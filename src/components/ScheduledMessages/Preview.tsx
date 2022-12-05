import { APIEmbed } from 'discord.js';
import './Preview.css';
import logo from '../../uncle.png';

interface PreviewProps {
  embed: APIEmbed;
  content: string;
  date: string;
}

function Preview({ embed, content, date }: PreviewProps) {
  const { author } = embed;
  return (
    <div className="side2">
      <div className="msgEmbed">
        <div className="contents">
          <img className="avatar embedLink" src={logo} alt=" " />
          <h2>
            <span className="username embedLink" role={'button'}>
              Uncle
            </span>
            <span className="botTag">
              {/* This should have a purple pill background */}
              <span className="botText">BOT</span>
            </span>
            {/* Maybe replace this with a timestamp instead? */}
            <span className="timeText">{date}</span>
          </h2>
        </div>
        {<div className="messageContent markup">{content}</div>}
        <div className="embedContainer">
          <div className="embed markup">
            <div className="embedGrid">
              <div className="embedAuthor embedMargin embedLink">
                <img className="embedAuthorIcon embedAuthorLink" src={author?.icon_url} alt=" " />
                <span className="embedAuthorNameLink embedLink embedAuthorName">{author?.name}</span>
              </div>
              {/* TODO: suport formatting voodoo in the description */}
              {embed.title && (
                <div className="embedTitle embedMargin" style={{ display: 'unset' }}>
                  {embed.url ? (
                    <a className="anchor" target={'_blank'} rel={'noreferrer'} href={embed.url}>
                      {embed.title}
                    </a>
                  ) : (
                    embed.title
                  )}
                </div>
              )}
              {/* TODO: suport formatting voodoo in the description */}
              <div className="embedDescription embedMargin">{embed.description}</div>
              {/* <div className="embedFields"></div> */}
              {/* <div className="imageWrapper clickable embedMedia embedImage">
                <img
                  className="img embedImageLink"
                  // onload="this.nextElementSibling?.style.removeProperty('display');"
                  alt=" "
                />
                <div className="spinner-container" style={{ display: 'block' }}>
                  <span className="spinner">
                    <span className="inner">
                      <span className="wanderingCubesItem"></span>
                      <span className="wanderingCubesItem"></span>
                    </span>
                  </span>
                </div>
              </div> */}
              {/* <div className="imageWrapper clickable embedThumbnail">
                <img
                  className="img embedThumbnailLink"
                  // onload="this.nextElementSibling?.style.removeProperty('display');"
                  alt=" "
                />
                <div className="spinner-container" style={{ display: 'block' }}>
                  <span className="spinner">
                    <span className="inner">
                      <span className="wanderingCubesItem"></span>
                      <span className="wanderingCubesItem"></span>
                    </span>
                  </span>
                </div>
              </div> */}
              {/* <div className="embedFooter embedMargin"></div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Preview;
