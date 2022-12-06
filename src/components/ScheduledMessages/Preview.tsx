import { APIEmbed } from 'discord.js';
import './Preview.css';
import logo from '../../uncle.png';
import { markup } from '../../helpers/formatting';
import parse from 'html-react-parser';
import { v4 as uuidv4 } from 'uuid';

interface PreviewProps {
  embed: APIEmbed;
  content: string;
  date: string;
}

function Preview({ embed, content, date }: PreviewProps) {
  const { author } = embed;
  let index = 0;
  let colNum = 1;
  let num=0
  let gridCol = '';
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
        {<div className="messageContent markup">{parse(markup(content, { replaceEmojis: true }))}</div>}
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
                      {parse(markup(embed.title, { replaceEmojis: true }))}
                    </a>
                  ) : (
                    parse(markup(embed.title, { replaceEmojis: true }))
                  )}
                </div>
              )}
              {embed.description && (
                <div className="embedDescription embedMargin">
                  {parse(markup(embed.description, { replaceEmojis: true, inEmbed: true }))}
                </div>
              )}
              <div className="embedFields">
                {embed.fields &&
                  embed.fields.map((field, i) => {
                    console.log(embed, i);
                    // if both this field and the next one are inline
                    if (
                      embed.fields?.at(i)?.inline &&
                      embed.fields?.at(i + 1)?.inline &&
                      // it's the first field in the embed or -
                      ((i === 0 && embed.fields?.at(i + 2) && !embed.fields?.at(i + 2)?.inline) || // it's not the first field in the embed but the previous field is not inline or -
                        (((i > 0 && !embed.fields?.at(i - 1)?.inline) ||
                          // it has 3 or more fields behind it and 3 of those are inline except the 4th one back if it exists -
                          (i >= 3 &&
                            embed.fields?.at(i - 1)?.inline &&
                            embed.fields?.at(i - 2)?.inline &&
                            embed.fields?.at(i - 3)?.inline &&
                            (embed.fields?.at(i - 4)
                              ? !embed.fields?.at(i - 4)?.inline
                              : !embed.fields?.at(i - 4)))) &&
                          // or it's the first field on the last row or the last field on the last row is not inline or it's the first field in a row and it's the last field on the last row.
                          (i === embed.fields.length - 2 || !embed.fields?.at(i + 2)?.inline)) ||
                        i % 3 === 0) &&
                      i == embed.fields.length - 2
                    ) {
                      // then make the field halfway (and the next field will take the other half of the embed).
                      index = i;
                      gridCol = '1 / 7';
                    }

                    if (i === i - 1) {
                      gridCol = '7 / 13';
                    }

                    if (!field.inline) {
                      return (
                        <div className="embedField" style={{gridColumn: "1 / 13"}}>
                          <div className="embedFieldName">
                            {parse(
                              markup(field.name, { replaceEmojis: true, inEmbed: true, inlineBlock: true })
                            )}
                          </div>
                          <div className="embedFieldValue">
                            {parse(
                              markup(field.value, {
                                replaceEmojis: true,
                                inEmbed: true,
                                inlineBlock: true
                              })
                            )}
                          </div>
                        </div>
                      )
                    } else {
                      if (i && !embed.fields?.at(i - 1)?.inline) {colNum = 1}
                      if (index !== i) gridCol = '';
                      
                      return <div className={`embedField ${num}${gridCol ? ' colNum-2' : ''}`} style={{gridColumn: `${gridCol || (colNum + ' / ' + (colNum + 4))}`}}>
                        <div className="embedFieldName">
                          {parse(markup(field.name, { replaceEmojis: true, inEmbed: true, inlineBlock: true }))}
                        </div>
                        <div className="embedFieldValue">
                          {parse(markup(field.value, {replaceEmojis: true, inEmbed: true}))}
                        </div>
                      </div>

                      
                  }
                  colNum = (colNum === 9 ? 1 : colNum + 4);
                  num=num+1;
                }
                  }
              </div>
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
