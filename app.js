const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.set("view engine", "ejs");

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = new mongoose.model("Article", articleSchema);



app.route("/articles")

  .get(function(req, res) {
    Article.find(function(err, data) {
      if (!err) {
        res.send(data);
      } else {
        res.send(err);
      }
    });
  })

  .post(function(req, res) {

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });

    newArticle.save(function(err) {
      if (!err) {
        res.send("Successfully added a new article");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) {
        res.send("Deleted");
      } else {
        res.send(err);
      }
    });
  });


////Specific articles

app.route("/articles/:articleName")

  .get(function(req, res){
    Article.findOne({title:req.params.articleName},function(err,result){
      if(result){
        res.send(result);
      }else
        res.send("No such articles exist");
    });
  })

  .put(function(req, res){
    Article.update(
      {title:req.params.articleName},
      {title:req.body.title, content:req.body.content},
      {overwrite: true},
      function(err){
        if(!err){
          res.send("Article has been updated Successfully");
        }
      }
    );
  })

  .patch(function(req, res){
    Article.update(
      {title:req.params.articleName},
      {$set: req.body},
      function(err){
        if(!err){
          res.send("Article has been updated Successfully");
        }
      }
    );
  })

  .delete(function(req, res){
    Article.deleteOne(
      {title:req.params.articleName},
      function(err){
        if(!err){
          res.send("Article deleted Successfully");
        }else{
          res.send(err);
        }
      }
    );
  });







app.listen(3000, function() {
  console.log("Server started on port 3000");
});
