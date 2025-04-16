import { X as AiOutlineClose } from "lucide-react";
import { useEffect, useState } from "react";
interface ModalProps {
  className?: string;
  title?: string;
  handleModalClose: () => void;
  children?: React.ReactNode;
  component?: React.ReactNode;
}

export function Modal({
  className,
  title,
  handleModalClose,
  children,
  component,
}: ModalProps) {
  const [showModal, setShowModal] = useState(false);

  // Trigger the modal visibility
  useEffect(() => {
    setShowModal(true);
  }, []);

  // Close the modal with a fade-out effect
  const closeModalWithAnimation = () => {
    setShowModal(false);
    setTimeout(handleModalClose, 300); // Wait for the fade-out to complete before closing
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-auto bg-gray-900 bg-opacity-90 flex items-center justify-center transition-opacity duration-300 ${
        showModal ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white  rounded-lg shadow-lg  overflow-auto ${className} transition-transform duration-300 sm:min-w-[40%] max-h-[90%] transform ${
          showModal ? "scale-100" : "scale-95"
        }`}
      >
        <div className="flex justify-between bg-secondary10 items-center mb-4 rounded-lg px-7 py-5">
          <h2 className="text-3xl font-bold text-[#323245] text-center w-full mx-auto">
            {title}
          </h2>
          <button onClick={closeModalWithAnimation} className="ml-auto">
            <AiOutlineClose className="hover:text-red-500 h-8 w-8 p-1" />
          </button>
        </div>
        <div className="p-10">{component ? component : children}</div>
      </div>
    </div>
  );
}
