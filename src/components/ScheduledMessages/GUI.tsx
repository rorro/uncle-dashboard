import { faImage, faPlusSquare, faRemove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { APIEmbed } from 'discord.js';
import { FormEventHandler, MouseEventHandler } from 'react';
import Collapsible from '../Collapsible';

interface IProps {
  messageId: number;
  content: string;
  embed: APIEmbed;
  handleRemoveField: MouseEventHandler;
  handleAddField: MouseEventHandler;
  handleSubmit: FormEventHandler<HTMLFormElement>;
}

function GUI({ messageId, content, embed, handleRemoveField, handleAddField, handleSubmit }: IProps) {
  function renderFields() {
    return (
      embed.fields &&
      embed.fields.map((f, index) => {
        return (
          <div key={index} data-messageid={messageId} className="field">
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
    <form onSubmit={handleSubmit} className="gui">
      <Collapsible title="Message Content" id={messageId}>
        <textarea className="input" defaultValue={content} placeholder={'Message content'} />
      </Collapsible>

      <Collapsible title="Author" id={messageId}>
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

      <Collapsible title={'Title'} id={messageId}>
        <input type="text" className="input" defaultValue={embed.title} placeholder={'Title'} />
      </Collapsible>

      <Collapsible title="Description" id={messageId}>
        <textarea className="input" defaultValue={embed.description} placeholder={'Embed description'} />
      </Collapsible>

      <Collapsible title={'Fields'} id={messageId}>
        {renderFields()}
        <label className="add_field" onClick={handleAddField}>
          Add field
          <FontAwesomeIcon icon={faPlusSquare} className="margin" />
        </label>
      </Collapsible>

      <Collapsible title={'Thumbnail'} id={messageId}>
        <FontAwesomeIcon icon={faImage} className="icon" />
        <input
          type="text"
          className="input"
          defaultValue={embed.thumbnail?.url}
          placeholder={'Thumbnail URL'}
        />
      </Collapsible>

      <Collapsible title={'Image'} id={messageId}>
        <FontAwesomeIcon icon={faImage} className="icon" />
        <input type="text" className="input" defaultValue={embed.image?.url} placeholder={'Image URL'} />
      </Collapsible>

      <Collapsible title="Footer" id={messageId}>
        <FontAwesomeIcon icon={faImage} className="icon" />
        <input
          type="text"
          className="input"
          defaultValue={embed.footer?.icon_url}
          placeholder={`Icon URL`}
        />
        <input
          type="text"
          className="input"
          defaultValue={embed.footer?.text}
          placeholder={'Footer text'}
        />
      </Collapsible>

      <button className="save_embed">
        <span>Save</span>
      </button>
    </form>
  );
}

export default GUI;
