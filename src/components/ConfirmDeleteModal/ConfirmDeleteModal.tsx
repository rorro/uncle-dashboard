import './ConfirmDeleteModal.css';
import { DeleteModalOptions } from '../../types';

interface ModalType {
  isOpen: boolean;
  toggle: () => void;
  confirmDelete: (messageId: number) => void;
  modalData: DeleteModalOptions | undefined;
}

function ConfirmDeleteModal({ isOpen, toggle, confirmDelete, modalData }: ModalType) {
  const { messageId, date, channel, embed } = modalData
    ? modalData
    : { messageId: -1, date: '1970-01-01 00:00', channel: '#deleted-channel', embed: { title: '' } };

  return (
    <>
      {isOpen && (
        <div className="modal-overlay" onClick={toggle}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <span>⚠️ Deleting Scheduled Message</span>
            <br />
            <h5>THIS ACTION IS IRREVERSIBLE!</h5>
            <table className="info-table">
              <tbody>
                <tr>
                  <td className="name">ID</td>
                  <td className="message-info">{messageId}</td>
                </tr>
                <tr>
                  <td className="name">TITLE</td>
                  <td className="message-info">{embed.title}</td>
                </tr>
                <tr>
                  <td className="name">DATE</td>
                  <td className="message-info">{date}</td>
                </tr>
                <tr>
                  <td className="name">CHANNEL</td>
                  <td className="message-info">#{channel}</td>
                </tr>
              </tbody>
            </table>
            <button className="confirm" onClick={() => confirmDelete(messageId)}>
              Confirm
            </button>
            <button className="cancel" onClick={toggle}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ConfirmDeleteModal;
