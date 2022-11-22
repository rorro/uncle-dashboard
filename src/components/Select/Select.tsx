import { ChangeEvent } from 'react';
import { ChannelType, GuildChannelEntry, OptGroupType } from '../../types';
import './Select.css';

const getOptGroups = (
  categories: GuildChannelEntry[],
  textChannels: GuildChannelEntry[]
): OptGroupType[] => {
  const optGroups: OptGroupType[] = [];

  for (const category of categories) {
    optGroups.push({ key: category, value: textChannels.filter(c => category.id === c.parentId) });
  }

  return optGroups;
};

function Select({
  guildChannels,
  name,
  selected,
  onChange
}: {
  guildChannels: GuildChannelEntry[];
  name: string;
  selected: string | null;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) {
  const categories = guildChannels.filter(ch => ch.type === ChannelType.Category);
  const textChannels = guildChannels.filter(ch => ch.type === ChannelType.Text);

  const optGroups = getOptGroups(categories, textChannels);

  return (
    <select name={name} id={name} onChange={onChange} value={selected ? selected : undefined}>
      <option value="">Disabled</option>
      {optGroups.map(optGroup => {
        return (
          <optgroup key={optGroup.key.id} label={optGroup.key.name}>
            {optGroup.value.map(c => {
              return (
                <option key={c.id} value={c.id}>
                  #{c.name}
                </option>
              );
            })}
          </optgroup>
        );
      })}
    </select>
  );
}

export default Select;
