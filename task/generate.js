var api = require('../db/api.js');
var apiSql = require('../db/dbSql.js');
var fs = require('fs');
var path = require('path');
// api.queryAll().then(res => {
//     let htmlStr = getCompStr(1, res);
//     console.log(htmlStr)
//     console.log('res', res)
//     exportFile(1, htmlStr);
// });

function queryJson(id) {
    return new Promise((resolve, reject) => {
        apiSql
            .query(
                `SELECT id,product_name FROM sf_product where top_product_id=${id}`
            )
            .then(res => {
                let idsArr = [];
                res.forEach((item, index) => {
                    idsArr.push(item.id);
                });
                apiSql
                    .query(`SELECT * FROM doc_json_modal where id in (${idsArr})`)
                    .then(res => {
                        let jss = res.map((item, index) => {
                            if (item.api_json) {
                                let data = JSON.parse(item.api_json);
                                let obj = {};
                                obj.name = data.name;
                                obj.id = data.id;
                                return obj;
                            }
                        });
                        let htmlStr = getCompStr(id, res);
                        exportFile(id, htmlStr);
                        resolve(jss);
                    });
            });
    });
}

function doMake() {
    let mixins = {};
    Promise.all([queryJson(1), queryJson(2)]).then(result => {
        mixins.nlp = result[0];
        mixins.scene = result[1];
        let mixinData = `
        const mixins = {
            data() {
                return {
                    list:${JSON.stringify(mixins)}
                }
            }
        }
        export default mixins;
        `;
        exportFile(10, mixinData);
    });
}
doMake();

function getCompStr(id, res) {
    let nlpStr = `
            <h1>基础NLP服务</h1>
            <h1 id="jj01" class="flag">简介</h1>
            <p class="mt10">Hi，您好，欢迎使用百度自然语言处理API服务。</p>
            <p>泰岳语义工厂基础NLP服务提供日常自然语言处理常用到的40+项服务！</p>
            <h2 id="dyfs" class="flag">调用方式</h2>
            <p>向API服务地址使用POST发送请求，需事先获取参数：</p>
            <p><strong>access_token:</strong>必须参数，参考<router-link :to="{path:'/apis/doc',query:{name:'jqrz'}}" replace>Access Token获取</router-link>。</p>
        `;
    let sceneStr = `
            <h1>场景应用服务</h1>
            <h1 id="jj01" class="flag">简介</h1>
            <p class="mt10">Hi，您好欢迎使用泰岳语义工厂场景应用服务。</p>
            <p>泰岳语义工厂场景应用服务包含多场景、多类型的自然语言处理服务！</p>
            <h2 id="dyfs" class="flag">调用方式</h2>
            <p>向API服务地址使用POST发送请求，需事先获取参数：</p>
            <p><strong>access_token:</strong>必须参数，参考<router-link :to="{path:'/apis/doc',query:{name:'jqrz'}}" replace>Access Token获取</router-link>。</p>
        `;
    let basic = '';
    switch (id) {
        case 1:
            basic = nlpStr;
            break;
        case 2:
            basic = sceneStr;
            break;
    }
    return (
        `<template>
        <div class="container">` +
        basic +
        res
        .map((item, index) => {
            let data = JSON.parse(item.api_json);
            if (data) {
                // console.log('data', data);
                return (
                    `
                <h1 id="${data.id}-01" class="flag">${data.name}</h1>
                <h2>接口描述</h2>
                <p>${data.note}</p>
                <h2 id="${data.id}-02" class="flag">请求说明</h2>
                <p><strong>请求参数</strong></p>
                <ul>
                <li>HTTP方法： <code>${data.method}</code></li>
                <li>请求URL：<code>${data.url}</code></li>
                <li>请求参数：</li>
                </ul>
                <table>
                <thead><tr><th>参数</th><th>值</th></tr></thead>
                <tbody>
                ` +
                    data.requestParam
                    .map((item2, index2) => {
                        if (item2.param !== 'token') {
                            return `<tr><td>${item2.param}</td><td>${item2.value}</td></tr>`;
                        } else {
                            return `<tr><td>${item2.param}</td><td>参考<router-link :to="{path:'/apis/doc',query:{name:'jqrz'}}">“鉴权认证机制”</router-link></td></tr>`;
                        }
                    })
                    .join('') +
                    `
                </tbody>
                </table>
                <p><strong>请求示例代码：</strong></p>
                <copy name="${data.id}-666">
                <template slot="java">
                  ${JSON.stringify(data.javaCode)}
                </template>
                <template slot="python">
                </template>
                </copy>
                <h2 id="${data.id}-03" class="flag">返回说明</h2>
                <p><strong>返回参数</strong></p>
                <table>
                <thead><tr><th>参数</th><th>是否必须</th><th>类型</th><th>值</th></tr></thead>
                <tbody>
                ` +
                    data.responseParam
                    .map((item2, index2) => {
                        return `
                     <tr>
                        <td>${item2.param}</td>
                        <td>${item2.isRequired}</td>
                        <td>${item2.type}</td>
                        <td>${item2.value}</td>
                    </tr>
                    `;
                    })
                    .join('') +
                    `
                </tbody>
                </table>
                <p><strong>返回示例</strong></p>
                <pre>
                    <code>
                        ${data.resCode}
                    </code>
                </pre>
        `
                );
            }
        })
        .join('') +
        `    </div>
    </template>`
    );
}

//创建文件夹
function mkdir(pos, dirArray, _callback) {
    var len = dirArray.length;
    if (pos >= len || pos > 10) {
        _callback();
        return;
    }
    var currentDir = '';
    for (var i = 0; i <= pos; i++) {
        if (i != 0) currentDir += '/';
        currentDir += dirArray[i];
    }
    fs.exists(currentDir, function(exists) {
        if (!exists) {
            fs.mkdir(currentDir, function(err) {
                if (err) {
                    console.log('创建文件夹出错！');
                } else {
                    console.log(currentDir + '文件夹-创建成功！');
                    mkdir(pos + 1, dirArray, _callback);
                }
            });
        } else {
            console.log(currentDir + '文件夹-已存在！');
            mkdir(pos + 1, dirArray, _callback);
        }
    });
}

//创建目录结构
function mkdirs(dirpath, _callback) {
    var dirArray = dirpath.split('/');
    fs.exists(dirpath, function(exists) {
        if (!exists) {
            mkdir(0, dirArray, function() {
                console.log('文件夹创建完毕!准备写入文件!');
                _callback();
            });
        } else {
            console.log('文件夹已经存在!准备写入文件!');
            _callback();
        }
    });
}
//写入文件
function exportFile(id, res) {
    let dir = '';
    switch (id) {
        case 1:
            dir = 'src/pages/apiDoc/nlp';
            break;
        case 2:
            dir = 'src/pages/apiDoc/scene';
            break;
        case 10:
            dir = 'src/mixins';
            break;
    }

    if (id == 10) {
        mkdirs(dir, () => makeFile(dir, 'api.js', res));
    } else {
        mkdirs(dir, () => makeFile(dir, 'childComp.vue', res));
    }
}

function makeFile(dir, fileName, res) {
    console.log(fileName);
    // fs.exists(path.join(dir, fileName), stat => {
    fs.writeFile(path.join(dir, fileName), res, err => {
        if (err) {
            console.log(err);
        } else {
            console.log('success');
        }
    });
    // });
}