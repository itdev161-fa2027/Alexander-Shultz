# Final Project Plan

## Milestone 1: Plan

Path: A

### Enhancement: Comments

What the user will see: The user will see a comment section below each post. If they are logged in, they can construct their own comments. If they have a comment, they can edit/delete it.
Back-end changes: A "Comment" model with post, user, body, createDate
Front-end changes: CommentList, CommentItem, CommentForm, PostDetail, api.js
New packages: none
What I will test:

- A logged-in user can add a comment
- Comments display below the post with the author's name and date
- The author of a comment can edit and delete it, with a confirmation before deleting
- Other users do not see Edit and Delete on a comment
- The server rejects an edit or delete from another user with a 403 status
- A visitor can read comments but does not see the comment form
- An empty comment is rejected
- Comments remain after a page refresh

### Task List

1. Create new model - Week 13
2. Create new packages - Week 13
3. Update PostDetail and api.js - Week 14
4. Add routes to server.js - Week 14
5. Potentially add CSS? - Week 15
6. Test to make sure everything works - Week 15

### Questions or Risks

Will we potentially get CSS for the components, or will we have to do that ourselves?

## AI Usage

Tools: none
