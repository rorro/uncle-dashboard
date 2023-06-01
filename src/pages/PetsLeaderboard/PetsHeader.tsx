import parse from 'html-react-parser';
import { markup } from '../../helpers/formatting';
import { PetEntry } from '../../types';

function PetsHeader({ pets }: { pets: PetEntry[] }) {
  return (
    <thead>
      <tr>
        <th className="pet-head"></th>
        {pets.map(pet => {
          return (
            <th className="pet-head" key={pet.name}>
              {parse(markup(pet.emoji, { replaceEmojis: true, inEmbed: false }))} <br />
              {pet.display_name}
            </th>
          );
        })}
      </tr>
    </thead>
  );
}

export default PetsHeader;
