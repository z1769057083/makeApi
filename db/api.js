var mongoose = require('./db.js'),
    Schema = mongoose.Schema;

var ApiSchema = new Schema({
    list: {
        type: Array
    }
});
const ApiModel = mongoose.model('api', ApiSchema);

//插入
function insert(data) {
    var Api = new ApiModel({
        list: data
    });
    Api.save((err, res) => {
        if (err) {
            console.log(err)
        } else {
            console.log(res)
        }
    })
}
//删除
function remove(id) {
    ApiModel.findByIdAndRemove(id, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.log('res', res)
        }
    })
}
//查询所有
function queryAll() {
    return new Promise((resolve, reject) => {
        ApiModel.find({}, (err, res) => {
            if (err) {
                console.log(err)
                reject(err)
            } else {
                resolve(res)
            }
        })
    })

}

function findByName() {
    ApiModel.find({
        'list.name': '中文命名实体识别'
    }, (err, res) => {
        if (err) {
            console.log(err)
        } else {
            console.log(res)
        }
    })
}

function update(id) {
    ApiModel.update({
        'list.name': '中文分词'
    }, {
        $set: {
            'list[0].id': 5
        }
    }, (err, res) => {
        if (err) {
            console.log(err)
        } else {
            console.log(res)
        }
    })
}
update();
// findByName();
module.exports = {
    insert,
    remove,
    queryAll
}