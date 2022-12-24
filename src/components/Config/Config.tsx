import './Config.css';
import { ConfigEntry, GuildChannelEntry } from '../../types';
import Select from '../Select';
import { useForm } from '../../hooks/useForm';
import ConfigDescriptions from '../../configDescriptions';
import { getCookie } from '../../utils/cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkSlash } from '@fortawesome/free-solid-svg-icons';

function Config({ data, guildChannels }: { data: ConfigEntry; guildChannels: GuildChannelEntry[] }) {
  async function handleSave() {
    const cookie = getCookie('access_token');

    await fetch(
      `http://${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/dashboard/savedata?accessToken=${cookie}&category=configs`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      }
    )
      .then(response => response.json())
      .then((data: { message: string }) => console.log(data.message));
    // TODO: do something better with the response than just logging it
  }

  const { onChange, onSubmit, values, valuesChanged } = useForm<ConfigEntry>(handleSave, data);

  return (
    <form onSubmit={onSubmit} className="config_form">
      {Object.entries(values).map(([key, val], index) => {
        return (
          <div key={index} className="item_box">
            <p>{ConfigDescriptions[key].name}</p>
            {key.includes('_channel') ? (
              <Select
                guildChannels={guildChannels}
                name={key}
                selected={values[key as keyof ConfigEntry]}
                onChange={onChange}
              />
            ) : (
              <input className="input" onChange={onChange} name={key} type="text" defaultValue={val} />
            )}
            <p className="information">{ConfigDescriptions[key].description}</p>
            {(key.includes('_icon') || key.includes('_image')) && val && (
              <>
                <img
                  src={val}
                  alt=""
                  onClick={e => window.open(e.currentTarget.src)}
                  onLoad={e => {
                    if (e.currentTarget.nextElementSibling) {
                      e.currentTarget.nextElementSibling.className = 'error hidden';
                    }
                  }}
                  onError={e => {
                    if (e.currentTarget.nextElementSibling) {
                      e.currentTarget.nextElementSibling.className = 'error';
                    }
                  }}
                />
                <div className="error hidden">
                  <FontAwesomeIcon icon={faLinkSlash} id="imageIcon" />
                  <label htmlFor="imageIcon"> Broken Image Link</label>
                </div>
              </>
            )}
          </div>
        );
      })}

      <button
        className="save_btn"
        style={valuesChanged ? { pointerEvents: 'all', backgroundColor: '#04AA6D' } : {}}
      >
        <span>Save </span>
      </button>
    </form>
  );
}

export default Config;
