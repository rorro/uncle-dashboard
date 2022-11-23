import { useState, MouseEvent, FormEvent } from 'react';
import { APIEmbed } from 'discord.js';
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
  // async function handleSave() {
  //   console.log(values);
  //   // const cookie = getCookie('access_token');
  //   // console.log(`cookie: ${cookie}`);

  //   // await fetch(`http://localhost:7373/dashboard/savedata?accessToken=${cookie}&category=configs`, {
  //   //   method: 'POST',
  //   //   headers: {
  //   //     'Content-Type': 'application/json'
  //   //   },
  //   //   body: JSON.stringify(values)
  //   // })
  //   //   .then(response => response.json())
  //   //   .then((data: { message: string }) => console.log(data.message));
  // }

  // const { onChange, onSubmit, values, valuesChanged } = useForm<ScheduledMessageEntry[]>(
  //   handleSave,
  //   scheduledMessages
  // );
  interface T {
    [id: number]: ScheduledMessageEntry;
  }
  const newObject: T = {};
  scheduledMessages.forEach(m => {
    newObject[m.id] = m;
  });

  const [messages, setMessages] = useState<T>(newObject);

  function addField(e: MouseEvent<HTMLLabelElement>) {
    const newField = { name: '', value: '', inline: false };
    const parentId = e.currentTarget.parentElement?.id;

    if (!parentId) return;

    const parentMessage = messages[+parentId];

    const { embed }: { content: string; embed: APIEmbed } = JSON.parse(parentMessage.message);
    embed.fields ? embed.fields.push(newField) : (embed.fields = [newField]);

    updateMessages(parentMessage, { embed: embed });
  }

  function removeField(e: MouseEvent<HTMLLabelElement>) {
    const parent = e.currentTarget.parentElement;

    const messageId = parent?.getAttribute('data-messageid');
    if (!parent || !messageId) return;

    const message = messages[+messageId];
    const { embed }: { content: string; embed: APIEmbed } = JSON.parse(message.message);
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

    updateMessages(message, { embed: embed });
  }

  function updateMessages(
    message: ScheduledMessageEntry,
    options: {
      id?: number;
      content?: string | undefined;
      embed?: APIEmbed | undefined;
      date?: string;
      channel?: string;
      type?: number;
    }
  ) {
    const { id, content, embed, date, channel, type } = options;
    const updatedMessage = {
      [message.id]: {
        id: id ? id : message.id,
        message: JSON.stringify({ content: content, embed: embed }),
        date: date ? date : message.date,
        channel: channel ? channel : message.channel,
        type: type ? type : message.type
      }
    };

    setMessages(prevMessages => ({
      ...prevMessages,
      ...updatedMessage
    }));
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
              title={embed.title || 'empty title'}
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
                />
                <div className="preview">PREVIEW GOES HERE</div>
              </div>
            </Collapsible>
          </div>
          // <form key={m.id} onSubmit={onSubmit} className="scheduled_message_form">
          //     {/* Message content: input area */}
          //     {/* Author: icon url, author name */}
          //     {/* Title: input */}
          //     {/* Description: input area */}
          //     {/* Fields: New field [+] -> field name: input, field value: input area */}
          //     {/* Thumbnail: url: input */}
          //     {/* Image: url: input*/}
          //     {/* Footer: input url, footer text: input*/}
          // </form>
        );
      })}
    </div>
  );
}

export default ScheduledMessages;
