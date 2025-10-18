import { memo } from "react";
import { CloseIcon } from "../../../icons";
import { QUILL_TOOLS_TUTORIAL } from "../../../constants";
import Modal from "../modal";

const QuillToolsGuideModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-full xs:max-w-80 sm:max-w-lg md:max-w-2xl lg:max-w-2xl bg-white rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Quill Tools Guide
          </h2>
          <button onClick={onClose} className="cursor-pointer">
            <CloseIcon />
          </button>
        </div>

        {/* Tools List */}
        <div className="space-y-6 max-h-[75vh] overflow-y-auto p-3">
          {QUILL_TOOLS_TUTORIAL.map((tool, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition-shadow p-4 sm:p-5 md:p-6"
            >
              {/* Tool Header */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={tool.icon}
                  alt={tool.name}
                  className="w-12 h-12 md:w-14 md:h-14 object-contain rounded-lg bg-gray-50 p-2"
                />
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                    {tool.name}
                  </h3>
                  {tool.description && (
                    <p className="text-sm md:text-base text-gray-600 mt-1">
                      {tool.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Video */}
              <div className="w-full overflow-hidden rounded-lg shadow-sm border border-gray-200">
                <video
                  controls={false}
                  autoPlay={true}
                  muted={true}
                  playsInline={true}
                  className="w-full h-auto rounded-lg"
                >
                  <source src={tool.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default memo(QuillToolsGuideModal);
