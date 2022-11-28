import { useState, MouseEvent, FormEvent, ChangeEvent } from 'react';
import { APIEmbed, EmbedBuilder } from 'discord.js';
import './ScheduledMessages.css';
import { GuildChannelEntry, ScheduledMessageEntry } from '../../types';
import Collapsible from '../Collapsible';
import GUI from './GUI';

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
  const newObject: T = {};
  scheduledMessages.forEach(m => {
    newObject[m.id] = m;
  });

  const [messages, setMessages] = useState<T>(newObject);

  function addField(messageId: number) {
    const newField = { name: '', value: '', inline: false };

    const message = messages[messageId];

    const { embed }: { embed: APIEmbed } = JSON.parse(message.message);
    embed.fields ? embed.fields.push(newField) : (embed.fields = [newField]);

    updateMessages(message, { embed: embed });
  }

  function removeField(messageId: number, e: MouseEvent<HTMLLabelElement>) {
    const parent = e.currentTarget.parentElement;

    if (!parent || !messageId) return;

    const message = messages[+messageId];
    const { embed }: { embed: APIEmbed } = JSON.parse(message.message);
    const fieldsContainer = document.querySelector(`[id='${messageId}']`);
    const fields = fieldsContainer?.querySelectorAll('.field');

    if (!fields) return;

    let clickedField: number | null = null;
    for (const [i, f] of Object.entries(fields)) {
      if (f === parent) {
        clickedField = +i;
        break;
      }
    }

    if (clickedField === null) return;
    embed.fields?.splice(clickedField, 1);
    console.log(embed.fields);

    updateMessages(message, { embed: embed });
  }

  function onChange(messageId: number, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const [name, key] = e.currentTarget.name.split(' ');
    console.log(name, key);

    const value = e.currentTarget.value;
    const scheduledMessage = messages[messageId];
    let { embed }: Record<string, any> = JSON.parse(scheduledMessage.message);

    let options: UpdateMessageOptions = {};
    switch (name as APIEmbed) {
      case 'content':
        options.content = value;
        break;
      case 'title':
        embed.title = value;
        break;
      case 'description':
        embed.description = value;
        break;
      case 'field':
        //possible keys: name, value
        break;
      case 'thumbnail':
      case 'image':
      case 'footer':
      case 'author':
        embed[name] = { ...embed[name], ...{ [key]: value } };
        break;
      case 'url':
        //TODO: add url in the gui
        break;
      case 'color':
        //TODO: add color picker in the gui
        break;

      default:
        break;
    }

    options.embed = embed;
    updateMessages(scheduledMessage, options);
  }

  interface UpdateMessageOptions {
    content?: string | undefined;
    embed?: APIEmbed | undefined;
    date?: string;
    channel?: string;
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

  async function onSubmitCallback() {
    console.log(`Saving embed to database!`);
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmitCallback();
  };

  return (
    <div>
      {Object.keys(messages).map(oId => {
        const { content, embed }: { content: string; embed: APIEmbed } = JSON.parse(
          messages[+oId].message
        );

        const { id, date, channel } = messages[+oId];

        return (
          <div className="container" key={id}>
            <Collapsible
              title={embed.title || '[empty title]'}
              id={id}
              date={date}
              channel={guildChannels.filter(c => c.id === channel)[0].name}
            >
              <div className="embed">
                <GUI
                  messageId={id}
                  content={content}
                  embed={embed}
                  handleRemoveField={removeField}
                  handleAddField={addField}
                  handleSubmit={onSubmit}
                  handleChange={onChange}
                />
                <div className="preview">PREVIEW GOES HERE</div>
              </div>
            </Collapsible>
          </div>
        );
      })}
    </div>
  );
}

export default ScheduledMessages;
