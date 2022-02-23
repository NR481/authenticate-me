import { useState } from "react";
import { Modal } from "../context/Modal";
import EditCheckinForm from "./EditCheckinForm";

const EditCheckinModal = ({ checkin, id, wineList, wine }) => {
  const [modal, setModal] = useState(false);

  return (
    <div>
      <button
        onClick={() => setModal(true)}
      >
        Edit Check-In
      </button>
      {modal && (
        <Modal onClose={() => setModal(false)}>
          <EditCheckinForm
            checkin={checkin}
            id={id}
            wineList={wineList}
            wine={wine}
            setModal={setModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default EditCheckinModal;
