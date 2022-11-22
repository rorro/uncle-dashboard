import { useForm } from '../../hooks/useForm';
import { GuildChannelEntry, ScheduledMessageEntry } from '../../types';
import Collapsible from '../Collapsible';
import './ScheduledMessages.css';
import { APIEmbed, APIEmbedField } from 'discord.js';
import { faImage, faRemove, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import GUI from './GUI';
import { useState, MouseEvent } from 'react';

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

    const { content, embed }: { content: string; embed: APIEmbed } = JSON.parse(parentMessage.message);
    embed.fields ? embed.fields.push(newField) : (embed.fields = [newField]);

    const updatedMessage = {
      [parentMessage.id]: {
        id: parentMessage.id,
        message: JSON.stringify({ content: content, embed: embed }),
        date: parentMessage.date,
        channel: parentMessage.channel,
        type: parentMessage.type
      }
    };

    setMessages(prevMessages => ({
      ...prevMessages,
      ...updatedMessage
    }));
  }

  function removeField(e: MouseEvent<HTMLLabelElement>) {
    const parent = e.currentTarget.parentElement;
    const messageId = parent?.getAttribute('data-messageid');
    if (!parent || !messageId) return;

    const message = messages[+messageId];
    const { content, embed }: { content: string; embed: APIEmbed } = JSON.parse(message.message);
    const field = parent.children;
    console.log(field);

    e.currentTarget.parentElement?.remove();
  }

  return (
    <div>
      messages count: {0}
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
                />
                <div className="preview">bla bla preview</div>
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
