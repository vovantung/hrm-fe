export const content = `
<blockquote><p style="text-align: justify"><span style="font-size: 16px; color: rgb(31, 47, 96)">Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.</span></p></blockquote><ol><li><p style="text-align: justify"><span style="font-size: 16px; color: rgb(138, 25, 5)">It is a way I have of driving off the spleen and regulating the circulation.</span></p></li><li><p style="text-align: justify"><span style="font-size: 16px; color: rgb(138, 25, 5)">Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul;</span></p></li><li><p style="text-align: justify"><span style="font-size: 16px; color: rgb(138, 25, 5)">whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet;</span></p></li></ol><ul><li><p style="text-align: justify"><span style="font-size: 16px; color: rgb(11, 90, 117)">and especially whenever my hypos get such an upper hand of me,</span></p></li><li><p style="text-align: justify"><span style="font-size: 16px; color: rgb(11, 90, 117)">that it requires a strong moral principle to prevent me from deliberately stepping into the street,</span></p></li></ul><p style="text-align: justify"><span style="font-size: 16px"><strong><em>And methodically knocking people’s hats off</em></strong>—</span><code>then, I account it high time to get to sea as soon as I can.</code><span style="font-size: 16px"> This is my substitute for pistol and ball. </span><span style="font-size: 16px; color: rgb(137, 109, 6)"><strong>With a philosophical flourish Cato throws himself</strong></span><span style="font-size: 16px"> </span><span style="font-size: 16px; color: rgb(29, 27, 27)">upon his sword; I quietly take to the ship. There is nothing surprising in this. If they but knew it, almost all men in their degree,</span><span style="font-size: 16px; color: rgb(13, 6, 122)"><strong> some time or other</strong></span><span style="font-size: 16px; color: rgb(29, 27, 27)">, cherish very nearly </span><span style="font-size: 16px; color: rgb(99, 13, 81)"><strong><em>the same</em></strong></span><span style="font-size: 16px; color: rgb(29, 27, 27)"> feelings towards the ocean with me.</span></p><div data-youtube-video=""><iframe width="640" height="480" allowfullscreen="true" autoplay="false" disablekbcontrols="false" enableiframeapi="false" endtime="0" ivloadpolicy="0" loop="false" modestbranding="false" origin="" playlist="" src="https://www.youtube-nocookie.com/embed/nPzPjPYJ2W8?controls=0" start="0"></iframe></div><pre><code class="language-javascript">
      package txu.shop.api;
      import lombok.RequiredArgsConstructor;
      import org.springframework.web.bind.annotation.*;
      import txu.shop.base.BaseApi;

      @RestController
      @RequestMapping("/article")
      @RequiredArgsConstructor
      public class ArticleApi extends BaseApi {

        private final ArticleService articleService;

        @PostMapping(value = "/get-all-article", consumes = "application/json")
        public List getAllArticle() {
          return articleService.getAllArticle();
        }
      }</code></pre><p style="text-align: justify"><span style="font-size: 16px; color: rgb(29, 27, 27)"><s>Circumambulate the city of a dreamy Sabbath afternoon. Go from Corlears Hook to Coenties Slip, and from thence, by Whitehall, northward. What do you see?—Posted like silent sentinels all around the town, stand thousands upon thousands of mortal men fixed in ocean reveries.</s> Some leaning against the spiles; </span></p><img src="https://images.pexels.com/photos/186979/pexels-photo-186979.jpeg?auto=compress&amp;cs=tinysrgb&amp;w=1260&amp;h=750&amp;dpr=1" class="responsive-img"><p style="text-align: justify"><span style="font-size: 16px; color: #cf0707"><em>But look! here come more crowds, pacing straight for the water, and seemingly bound for a dive. Strange! Nothing will content them but the extremest limit of the land; loitering under the shady lee of yonder warehouses will not suffice. No.</em></span></p>
`

const Content = () => {
  return <></>
}

export default Content
