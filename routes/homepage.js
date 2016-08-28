exports.get = function(req, res) {
    var db = req.db;
    var collection = db.get('imgIndexInfo');
    collection.find({},{},function(e,docs){
        console.log(docs);
        res.render('index', {
            docs : docs,
            title: "Polka.ru"
        });
});};
