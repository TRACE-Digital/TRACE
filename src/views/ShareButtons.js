function ShareButtons() {



function handleClick() {
    //do this when a button is clicked
};

  return (
    <>
      <div className="popup">
            <div className="title">Share</div>
                <div>
                    <a href="http://www.facebook.com" target="_blank">
                        <img src="https://facebookbrand.com/wp-content/uploads/2019/04/f_logo_RGB-Hex-Blue_512.png?w=512&h=512" alt="Facebook Logo" className="share-button"/>
                    </a>
                    <a href="http://www.twitter.com" target="_blank">
                        <img src="https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/twitter_circle-512.png" alt="Twitter Logo" className="share-button"/>
                    </a>
                    <a href="http://www.reddit.com" target="_blank">
                        <img src="https://cdn3.iconfinder.com/data/icons/2018-social-media-logotypes/1000/2018_social_media_popular_app_logo_reddit-512.png" alt="Reddit Logo" className="share-button"/>
                    </a>
                    <a href="http://www.linkedin.com" target="_blank">
                        <img src="https://cdn4.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-free/128/social-linkedin-circle-512.png" alt="LinkedIn Logo" className="share-button"/>
                    </a>
                </div>
            </div>
        </>
    );
}

export default ShareButtons;
