import { useState, MouseEvent, FormEvent, ChangeEvent } from 'react';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { APIEmbed } from 'discord.js';
import './ScheduledMessages.css';
import {
  ExtendedAPIEmbedField,
  GuildChannelEntry,
  ScheduledMessageEntry,
  UpdateMessageOptions
} from '../../types';
import Collapsible from '../Collapsible';
import GUI from './GUI';
import { v4 as uuidv4 } from 'uuid';
import { getCookie } from '../../utils/cookie';
import { ColorResult } from '@hello-pangea/color-picker';

function ScheduledMessages({
  scheduledMessages,
  guildChannels
}: {
  scheduledMessages: ScheduledMessageEntry[];
  guildChannels: GuildChannelEntry[];
}) {
  interface T {
    [id: number]: ScheduledMessageEntry;
  }
  const initialMessages: T = {};
  scheduledMessages.forEach(m => {
    const { content, embed } = JSON.parse(m.message);
    const fields = embed.fields;

    // Add a unique key to each field so that rendering them works properly
    if (fields) {
      fields.forEach((f: Record<string, string | boolean>) => {
        f['key'] = uuidv4();
      });
      m.message = JSON.stringify({ content: content, embed: embed });
    }
    initialMessages[m.id] = m;
  });

  const [messages, setMessages] = useState<T>(initialMessages);

  function addField(messageId: number) {
    const newField: ExtendedAPIEmbedField = { name: '', value: '', inline: false, key: uuidv4() };

    const message = messages[messageId];

    const { embed }: { embed: APIEmbed } = JSON.parse(message.message);
    embed.fields ? embed.fields.push(newField) : (embed.fields = [newField]);

    updateMessages(message, { embed: embed });
  }

  function getClickedField(
    messageId: number,
    e: MouseEvent<HTMLLabelElement> | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): number | null {
    const parent = e.currentTarget.parentElement;

    const fieldsContainer = document.querySelector(`[id='${messageId}']`);
    const fields = fieldsContainer?.querySelectorAll('.field');

    if (!fields) return null;

    let clickedField: number | null = null;
    for (const [i, f] of Object.entries(fields)) {
      if (f === parent) {
        clickedField = +i;
        break;
      }
    }
    return clickedField;
  }

  function removeField(messageId: number, e: MouseEvent<HTMLLabelElement>) {
    const clickedField = getClickedField(messageId, e);
    if (clickedField === null) return;

    const message = messages[messageId];
    const { embed } = JSON.parse(message.message);

    embed.fields.splice(clickedField, 1);

    updateMessages(message, { embed: embed });
  }

  function onColorPicked(messageId: number, color: ColorResult) {
    const col = parseInt(color.hex.substring(1), 16);

    const scheduledMessage = messages[messageId];
    let { embed }: Record<string, any> = JSON.parse(scheduledMessage.message);
    embed['color'] = col;

    updateMessages(scheduledMessage, { embed: embed });
  }

  function onChange(messageId: number, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const [name, key] = e.currentTarget.name.split(' ');

    const value =
      key === 'inline'
        ? (e as ChangeEvent<HTMLInputElement>).currentTarget.checked
        : e.currentTarget.value;

    const scheduledMessage = messages[messageId];
    let { embed }: Record<string, any> = JSON.parse(scheduledMessage.message);

    let options: UpdateMessageOptions = {};
    switch (name as APIEmbed) {
      case 'content':
        options.content = value.toString();
        break;
      case 'title':
      case 'description':
      case 'url':
        embed[name] = value;
        break;

      case 'thumbnail':
      case 'image':
      case 'footer':
      case 'author':
        embed[name] = { ...embed[name], ...{ [key]: value } };
        break;

      case 'fields':
        const clickedField = getClickedField(messageId, e);
        if (clickedField === null) break;
        embed[name][clickedField] = { ...embed[name][clickedField], ...{ [key]: value } };
        break;
    }

    options.embed = embed;
    updateMessages(scheduledMessage, options);
  }

  function updateMessages(message: ScheduledMessageEntry, options: UpdateMessageOptions) {
    const { content, embed, date, channel } = options;
    const { content: originalContent, embed: originalEmbed } = JSON.parse(message.message);

    const updatedMessage = {
      id: message.id,
      message: JSON.stringify({
        content: content ? content : originalContent,
        embed: embed ? embed : originalEmbed
      }),
      date: date ? date : message.date,
      channel: channel ? channel : message.channel,
      type: message.type
    };

    setMessages({
      ...messages,
      [message.id]: updatedMessage
    });
  }

  async function onSubmitCallback(messageId: number) {
    console.log(`Saving embed to database!`);
    const cookie = getCookie('access_token');

    await fetch(
      `http://localhost:7373/dashboard/savedata?accessToken=${cookie}&category=scheduled_messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messages[messageId])
      }
    )
      .then(response => response.json())
      .then((data: { message: string }) => console.log(data.message));
    // TODO: do something better with the response than just logging it
  }

  const onSubmit = async (messageId: number, event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmitCallback(messageId);
  };

  function handleAddNewMessage() {
    console.log('adding new message');
  }

  return (
    <div className="wrapper">
      <button id="new_message" onClick={handleAddNewMessage}>
        ADD MESSAGE
        <FontAwesomeIcon style={{ marginLeft: '5px' }} icon={faPlusSquare} />
      </button>
      {Object.keys(messages).map(oId => {
        const { id, date, channel, message } = messages[+oId];
        const { embed }: { embed: APIEmbed } = JSON.parse(message);

        return (
          <div className="container" key={id}>
            <Collapsible
              title={embed.title || '[empty title]'}
              id={id}
              date={date}
              channel={guildChannels.filter(c => c.id === channel)[0].name}
            >
              <GUI
                scheduledMessage={messages[+oId]}
                handleRemoveField={removeField}
                handleAddField={addField}
                handleSubmit={onSubmit}
                handleChange={onChange}
                handleColorPicked={onColorPicked}
              />
              <div className="preview">PREVIEW GOES HERE</div>
            </Collapsible>
          </div>
        );
      })}
    </div>
  );
}

export default ScheduledMessages;
