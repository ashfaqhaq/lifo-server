const { AuthenticationError, UserInputError } = require('apollo-server');

const Post = require("../../models/Post");
const checkAuth = require('../../utils/check-auth');

module.exports = {
  Mutation: {
    async createComment(_, { postId, body }, context) {
      const { username } = checkAuth(context);
      if (body.trim() === '') {
        throw new UserInputError('Empty comment', {
          errors: {
            body: 'Comment body must not empty'
          }
        });
      }
      try {
        const post = await Post.findById(postId);

        if (post) {
          post.comments.unshift({
            username,
            body,
            createdAt: new Date().toISOString()
          });
          await post.save();
          return post;
        }

        else {
          throw new UserInputError('Post not found');
        }
      }

      catch (err) {
        throw new Error(err);
      }
    },
    async deleteComment(_, { postId, commentId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);
      if (post) {
             
        const commentIndex = post.comments.findIndex(item => item.id === commentId);

        if ((post.comments[commentIndex].username === username)||(post.username=== username)) {
          post.comments.splice(commentIndex, 1);
          await post.save();
          return post;
        } else {

          throw new AuthenticationError('Action not allowed');
        }
      } else {
        throw new UserInputError('Post not found');
      }
    }
  }
}
