using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using KeyFunc.Repos;
using KeyFunc.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

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
        public async Task<Post> CreatePost([FromBody] Post post)
        {
            post.createdAt = DateTime.Now;
            _postRepository.Add(post);
            await _postRepository.Save();

            return post;
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

                Console.WriteLine("its asll good!");
                return followerPosts;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return e.Message;
            }

            return null;
        }



    }
}

