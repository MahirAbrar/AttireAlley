"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useRouter } from "next/navigation";

export default function CommonModal({
  modalTitle,
  showButtons,
  buttonComponent,
  show,
  setShow,
  showModalTitle,
  checkBoxRef,
  navOptions,
  adminNavOptions,
  isAdminView,
}) {
  const handleClose = () => {
    setShow(false);
    checkBoxRef.current.checked = false;
  };

  const router = useRouter();

  const mainContent = isAdminView ? adminNavOptions : navOptions;
  return (
    // show is a headless ui attribute to show or not show
    <Transition.Root show={show} as={Fragment}>
      <Dialog as="div" className={"relative z-10"} onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-900"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-900"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-500"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Panel className={"w-screen max-w-md"}>
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      {showModalTitle ? (
                        <div className="flex items-start justify-between">
                          <Dialog.Title>{modalTitle}</Dialog.Title>
                        </div>
                      ) : null}
                      <div className="mt-20">
                        <ul>
                          {mainContent.map((item) => (
                            <li
                              key={item.id}
                              className="block rounded bg-none px-3 py-2 text-black hover:bg-sky-700 hover:text-white"
                              onClick={() => router.push(item.path)}
                            >
                              {item.label}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    {showButtons ? (
                      <div className="border-none px-4 py-6 sm:px-6">
                        {buttonComponent}
                      </div>
                    ) : null}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
