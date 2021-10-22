import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let reviews;

export default class ReviewsDAO {
  static async injectDB(conn) {
    if (reviews) {
      return;
    }
    try {
      reviews = await conn.db(process.env.RESTVIEWS_ns).collection("reviews");
    } catch (e) {
      console.error(`Unableto establish collection handles in userDAO: ${e}`);
    }
  }

  static async updateReview(reviewId,userId,text,date){
      try {
          const updateResponse=await reviews.updateOne(
              {user_id:userId, _id=ObjectId(reviewId)},
              {$set:{text:text,date:date}},
          )
          return updateResponse;
      } catch (e) {
          console.error(`Unable to update review:${e}`);
          return{error:e};
      }
  }

  static async deleteReview(reviewId, userId){
      try {
          const deleteResponse = await reviews.deleteOne({
              _id:ObjectId(reviewId),
              user_id:userId,
          })
          return deleteResponse;
      } catch (e) {
          console.error(`Unable to delete review:${e}`);
          return{error:e};
      }
  }


}
