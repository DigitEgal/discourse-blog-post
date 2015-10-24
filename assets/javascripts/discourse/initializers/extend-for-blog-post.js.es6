import TopicView from 'discourse/views/topic';
import PostView from 'discourse/views/post'
import CloakedView from 'discourse/views/cloaked';
import TopicModel from 'discourse/models/topic';
import TopicController from 'discourse/controllers/topic';

function helloFrom(location) {
  console.log('Hello from ', location);
}

export default {
  name: 'extend-for-blog-post',

  initialize() {
    TopicModel.reopen({});

    // Controllers maintain state based on the current route. In general, models
    // have properties that are saved to the server, controllers have properties that
    // do not need to be saved.
    TopicController.reopen({
      blogCategory: function () {
        return this.siteSettings.blog_post_category;
      }.property(),

      blogCategoryClass: function () {
        return this.get('blogCategory').replace(/ /g, '-');
      }.property('blogCategory'),

      isBlog: function () {
        const currentCategory = this.get('model.category.fullSlug');
        return this.get('blogCategoryClass') === currentCategory;
      }.property('model.category.fullSlug'),

      postDate: function () {
        return new Date(this.get('model.created_at')).toLocaleDateString();
      }.property('model.created_at'),

      firstPoster: function () {
        const postStream = this.get('model.postStream');
        if (!postStream) { return; }
        return postStream.get('posts')[0].username;
      }.property('model.postStream'),

      firstPost: function () {
        const postStream = this.get('model.postStream');
        if ( !postStream ) { return; }
        if ( !postStream.get('posts')[0]) { return; }

        return postStream.get('posts')[0].cooked;
      }.property('model.postStream'),

      bgImgURLs: function () {
        const firstPost = this.get('firstPost');
        if (!firstPost) { return; }
        let $firstPost = $($.parseHTML(firstPost));
        return $firstPost.find('.header-image');
      }.property('firstPost'),

      hasBgImg: function () {
        const bgImgURLs = this.get('bgImgURLs');
        if (!bgImgURLs) { return; }
        return bgImgURLs.length;
      }.property('bgImgURLs'),

    });

    TopicView.reopen({

    });

    PostView.reopen({
      firstPost: Em.computed.alias('controller.firstPost'),
      blogCategory: Em.computed.alias('controller.blogCategory'),
      blogCategoryClass: Em.computed.alias('controller.blogCategoryClass'),
      isBlog: Em.computed.alias('controller.isBlog'),
      bgImgURLs: Em.computed.alias('controller.bgImgURLs'),
      hasBgImg: Em.computed.alias('controller.hasBgImg'),
      postDate: Em.computed.alias('controller.postDate'),
      firstPoster: Em.computed.alias('controller.firstPoster'),

      addBlogBodyClass: function () {
        if (this.get('isBlog')) {
          $('body').addClass('blog-post');
        }
      }.on('didInsertElement'),

      removeBlogBodyClass: function () {
        if (this.get('isBlog')) {
          $('body').removeClass('blog-post');
        }
      }.on('willDestroyElement'),

      sayHello: function () {
        helloFrom('post view insert');
        console.log('the blog category class is ', this.get('blogCategoryClass'));
        console.log('is this a blog?', this.get('isBlog'));
        console.log('bg image', this.get('bgImgURLs'));
        console.log('has background image', this.get('hasBgImg'));
        console.log('post date', this.get('postDate'));
        console.log('first poster', this.get('firstPoster'));
        console.log('first from post view', this.get('firstPost'));
      }.on('didInsertElement'),

      //sayGoodBye: function () {
      //  helloFrom('post view will destroy');
      //}.on('willDestroyElement'),

    });


    //CloakedView.reopen({
    //  firstPost: Em.computed.alias('controller.firstPost'),
    //  sayHello: function () {
    //    helloFrom('cloaked view insert');
    //    console.log('first from cloaked view', this.get('firstPost'));
    //  }.on('didInsertElement'),
    //
    //  sayGoodBye: function () {
    //    helloFrom('cloaked view will destroy');
    //  }.on('willDestroyElement'),
    //});
  }
}
