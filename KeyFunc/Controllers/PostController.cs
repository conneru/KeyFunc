using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using KeyFunc.DTO;
using KeyFunc.Models;
using KeyFunc.Repos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Hosting;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace KeyFunc.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PostController : ControllerBase
    {
        IPostRepository _postRepository;


        public PostController(IPostRepository postRepository)
        {
            _postRepository = postRepository;
 
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<Post> GetPost(int id)
        {
            try
            {
                Post post = await _postRepository.GetPostDetails(id);

                return post;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }

            return null;
        }

        [HttpPost]
        public async Task<List<string>> CreatePost([FromBody] CreatePostDTO post)
        {

                Console.WriteLine($"{post.Description} {post.UserId} {post.ContentTypes}");
                string bucketName = "keyfunc-images";
                RegionEndpoint region = RegionEndpoint.USWest2;
                List<string> urls = new();
                List<Image> images = new();

                Post newPost = new();
                newPost.UserId = post.UserId;
                newPost.Description = post.Description;
                newPost.createdAt = DateTime.Now;

                for (int i = 0; i < post.ContentTypes.Count; i++)
                {
                    string type = post.ContentTypes[i];
                    string key = Regex.Replace(Convert.ToBase64String(Guid.NewGuid().ToByteArray()), "[/+=]", "");

                    urls.Add(PresignS3Url(type, bucketName, region, key));

                    Image img = new();
                    img.URL = $"https://{bucketName}.s3.us-west-2.amazonaws.com/{key}";
                    img.OrderNum = i + 1;

                    img.Tags = post.Tags[i];



                    images.Add(img);
                }

                newPost.Images = images;

                _postRepository.Add(newPost);
                await _postRepository.Save();

                return urls;
           

        }


        [HttpDelete]
        public async Task<StatusCodeResult> DeletePost([FromBody] Post post)
        {
            _postRepository.Delete(post);
            await _postRepository.Save();

            return StatusCode(200);
        }

        [HttpPost]
        [Route("feed")]
        public async Task<Object> GetFollowingPosts([FromBody] User user)
        {
            try
            {
                IEnumerable<Post> followerPosts = await _postRepository.GetFollowingPosts(user);

                return followerPosts;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return e.Message;
            }
        }


        private static string PresignS3Url(string type,string bucket,RegionEndpoint region,string key)
        {

            var config = new AmazonS3Config
            {
                RegionEndpoint = region // Replace YOUR_REGION with the appropriate AWS region (e.g., RegionEndpoint.USWest2)
            };

            string accessKey = "AKIATOCPJ6GSSK4W4U4W";
            string secretKey = "c1zRxwYmFwJa3qdV/LBmkFcB8HyuRXikMa4cO8eJ";


            var credentials = new Amazon.Runtime.BasicAWSCredentials(accessKey, secretKey);

            var client = new AmazonS3Client(credentials, config);
            var request = new GetPreSignedUrlRequest
            {
                BucketName = bucket,
                Key = key,
                Expires = DateTime.UtcNow.AddMinutes(5), // Adjust the expiration time as needed
                ContentType = type, // Specify the content type if known
                Verb = HttpVerb.PUT
            };



            return client.GetPreSignedURL(request);
        }
    }
}
