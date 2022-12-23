import { faLinkSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { APIEmbed } from 'discord.js';
import './Preview.css';
import logo from '../../uncle.png';
import { markup } from '../../helpers/formatting';
import parse from 'html-react-parser';
import { v4 as uuidv4 } from 'uuid';
import { SyntheticEvent } from 'react';

interface PreviewProps {
  embed: APIEmbed;
  content: string;
  date: string;
}

function Preview({ embed, content, date }: PreviewProps) {
  const { author, title, description, url, fields, image, thumbnail, footer, color } = embed;

  function handleIconError(e: SyntheticEvent<HTMLImageElement>) {
    e.currentTarget.src = 'https://i.imgur.com/F0yt4Gr.png';
  }
  // Please don't look at this function. It's not pretty.
  function determineGridColumns(): Record<number, string> {
    const gridColumns: Record<number, string> = {};

    if (!fields) return {};
    for (let i = 0; i < fields.length; i++) {
      // It's first on the row or it's the first field in the embed
      if (
        fields[i].inline &&
        // If it's the first field in the embed
        (!fields[i - 1] ||
          // If it's not the first field in embed and the previous field is not inline
          (fields[i - 1] && !fields[i - 1].inline) ||
          // If current field has 3 inline fields before it, it's the first field on a new row
          (fields[i - 1] &&
            fields[i - 1].inline &&
            fields[i - 2] &&
            fields[i - 2].inline &&
            fields[i - 3] &&
            fields[i - 3].inline))
      ) {
        // If the next one is inline
        if (fields[i + 1] && fields[i + 1].inline) {
          // if the next is inline but not the third next
          if (
            // If it's the second to last field in the embed
            !fields[i + 2] ||
            // Or if the third field after current is not inline
            (fields[i + 2] && !fields[i + 2].inline)
          ) {
            // Occupy half
            gridColumns[i] = '1 / 7';
            gridColumns[i + 1] = '7 / 13';
            i++;
          }
          // 3 inline fields in a row
          else {
            // Occupy a third
            gridColumns[i] = '1 / 5';
            gridColumns[i + 1] = '5 / 9';
            gridColumns[i + 2] = '9 / 13';
            i += 2;
          }
        } else {
          gridColumns[i] = '1 / 13';
        }
      }
      // It's second on the row
      else if (
        fields[i].inline &&
        fields[i - 1] &&
        fields[i - 1].inline &&
        fields[i - 2] &&
        !fields[i - 2].inline
      ) {
        // If previous and current are inline but not the next
        if (fields[i + 1] && !fields[i + 1].inline) {
          // Occupy half
          gridColumns[i - 1] = '1 / 7';
          gridColumns[i] = '1 / 7';
        }
        // 3 inline fields in a row
        else {
          // Occupy a third
          gridColumns[i - 1] = '1 / 5';
          gridColumns[i] = '5 / 9';
          gridColumns[i + 1] = '9 / 13';
          i++;
        }
      }
      // It's the third on the row
      else if (
        fields[i].inline &&
        fields[i - 1] &&
        fields[i - 1].inline &&
        fields[i - 2] &&
        fields[i - 2].inline &&
        fields[i - 3] &&
        !fields[i - 3].inline
      ) {
        // Occupy a third
        gridColumns[i - 2] = '1 / 5';
        gridColumns[i - 1] = '5 / 9';
        gridColumns[i] = '9 / 13';
      } else {
        gridColumns[i] = '1 / 13';
      }
    }
    return gridColumns;
  }

  const gridColumns = determineGridColumns();

  return (
    <div className="preview">
      <div className="msgEmbed">
        <div className="contents">
          <img className="avatar embedLink" src={logo} alt=" " />
          <h2>
            <span className="username embedLink" role={'button'}>
              Uncle
            </span>
            <span className="botTag">
              <span className="botText">BOT</span>
            </span>
            {/* Maybe replace this with a timestamp instead? */}
            <span className="timeText">{date}</span>
          </h2>
        </div>
        {<div className="messageContent markup">{parse(markup(content, { replaceEmojis: true }))}</div>}
        <div className="embedContainer">
          <div
            className="embed markup"
            style={{ borderColor: color ? `#${color.toString(16)}` : '#1e2327' }}
          >
            <div className="embedGrid">
              {author?.name && (
                <div className="embedAuthor embedMargin embedLink">
                  <img
                    className="embedAuthorIcon embedAuthorLink"
                    src={author?.icon_url}
                    alt=" "
                    onError={handleIconError}
                  />
                  <span className="embedAuthorNameLink embedLink embedAuthorName">{author.name}</span>
                </div>
              )}
              {title && (
                <div className="embedTitle embedMargin" style={{ display: 'unset' }}>
                  {url ? (
                    <a className="anchor" target={'_blank'} rel={'noreferrer'} href={url}>
                      {parse(markup(title, { replaceEmojis: true }))}
                    </a>
                  ) : (
                    parse(markup(title, { replaceEmojis: true }))
                  )}
                </div>
              )}
              {description && (
                <div className="embedDescription embedMargin">
                  {parse(markup(description, { replaceEmojis: true, inEmbed: true }))}
                </div>
              )}
              {fields && fields.length > 0 && (
                <div className="embedFields">
                  {fields.map((field, i) => {
                    return (
                      (field.name || field.value) && (
                        <div
                          key={uuidv4()}
                          className="embedField"
                          style={{
                            gridColumn: gridColumns[i] && gridColumns[i]
                          }}
                        >
                          <div className="embedFieldName">
                            {parse(markup(field.name, { replaceEmojis: true, inEmbed: true }))}
                          </div>
                          <div className="embedFieldValue">
                            {parse(markup(field.value, { replaceEmojis: true, inEmbed: true }))}
                          </div>
                        </div>
                      )
                    );
                  })}
                </div>
              )}
              {image?.url && (
                <div className="imageWrapper embedMedia embedImage">
                  <img className="img embedImageLink" alt=" " src={image.url} />
                  <div className="error">
                    <FontAwesomeIcon icon={faLinkSlash} id="imageIcon" />
                    <label htmlFor="imageIcon"> Broken Image Link</label>
                  </div>
                </div>
              )}
              {thumbnail?.url && (
                <div className="imageWrapper embedThumbnail">
                  <img className="img embedThumbnailLink" alt=" " src={thumbnail.url} />
                  <div className="error">
                    <FontAwesomeIcon icon={faLinkSlash} id="thumbnailIcon" />
                    <label htmlFor="thumbnailIcon"> Broken Thumbnail Link</label>
                  </div>
                </div>
              )}

              {footer?.text && (
                <div className="embedFooter embedMargin">
                  {footer?.icon_url && (
                    <div>
                      <img
                        className="embedFooterIcon embedFooterLink"
                        src={footer.icon_url}
                        alt=" "
                        onError={handleIconError}
                      />
                    </div>
                  )}
                  <span className="embedFooterText">{footer.text}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Preview;
