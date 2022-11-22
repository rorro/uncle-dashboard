import { faImage, faPlusSquare, faRemove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { APIEmbed, APIEmbedField } from 'discord.js';
import React, { MouseEvent, MouseEventHandler, useEffect, useState } from 'react';
import { ScheduledMessageEntry } from '../../types';
import Collapsible from '../Collapsible';

interface IProps {
  messageId: number;
  content: string;
  embed: APIEmbed;
  handleRemoveField: MouseEventHandler;
  handleAddField: MouseEventHandler;
}

function GUI({ messageId, content, embed, handleRemoveField, handleAddField }: IProps) {
  function renderFields() {
    return (
      embed.fields &&
      embed.fields.map((f, index) => {
        return (
          <div key={index} data-messageid={messageId}>
            <input
              type="text"
              className="input"
              defaultValue={f?.name}
              placeholder={'Field name'}
              name={'field_name'}
            />
            <textarea
              className="input"
              defaultValue={f?.value}
              placeholder={'Field value'}
              name={'field_value'}
            />
            <br />
            <label className="inline">
              <input
                type="checkbox"
                className="checkbox"
                defaultChecked={f?.inline}
                name={'field_inline'}
              />
              Inline
            </label>

            <label onClick={handleRemoveField}>
              <FontAwesomeIcon icon={faRemove} className="margin" />
              Remove
            </label>
          </div>
        );
      })
    );
  }

  return (
    <div className="gui">
      <Collapsible title="Message Content">
        <textarea className="input" defaultValue={content} placeholder={'Message content'} />
      </Collapsible>

      <Collapsible title="Author">
        <FontAwesomeIcon icon={faImage} className="icon" />
        <input
          type="text"
          className="input"
          defaultValue={embed.author?.icon_url}
          placeholder={`Icon URL`}
        />
        <input
          type="text"
          className="input"
          defaultValue={embed.author?.name}
          placeholder={'Author name'}
        />
      </Collapsible>

      <Collapsible title={'Title'}>
        <input type="text" className="input" defaultValue={embed.title} placeholder={'Title'} />
      </Collapsible>

      <Collapsible title="Description">
        <textarea className="input" defaultValue={embed.description} placeholder={'Embed description'} />
      </Collapsible>

      <Collapsible title={'Fields'}>
        <div id={messageId.toString()}>
          {renderFields()}
          <label className="add_field" onClick={handleAddField}>
            Add field
            <FontAwesomeIcon icon={faPlusSquare} className="margin" />
          </label>
        </div>
      </Collapsible>
    </div>
  );
}

export default GUI;
