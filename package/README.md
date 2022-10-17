# 🧊 Modal windows controller

A simple utility mobx store for managing application modal windows.

This controller supports five different modal window states:

| State         | Description                              |
|---------------|------------------------------------------|
| OPEN          | Modal window open                        |
| MOUNT         | Modal window mounted into DOM tree       |
| OPENING       | Modal window opens                       |
| CLOSE         | Modal window closed                      |
| CLOSING       | Modal window closes                      |
| NOT_CONNECTED | Modal window not connected to controller |

To get started, connect (register) a unique modal window key in a controller:

```ts
import modalWindowController from "@knownout/modal-window-controller";
modalWindowController.connectModalWindow("MyCoolWindow");

// Also, modal window key can be disconnected from controller:
modalWindowController.disconnectModalWindow("MyOldModal");
```

Modal window state update rate *(CLOSING → CLOSE, MOUNT → OPENING → OPEN)*
can be changed as follows *(default is 300ms)*:

```ts
modalWindowController.updateStateChangeTime(600);
```

Open and close methods can be used to change state of specific modal window.
These methods do not immediately change window state to CLOSE or OPEN, but run
state change algorithm (CLOSING → CLOSED, etc.):

```ts
modalWindowController.openModal("MyCoolModal");

modalWindowController.closeModal("MyCoolModal");
```

To get current state of the modal, you can use `getModalState` method:

```ts
modalWindowController.getModalState("MyCoolModal"); // CLOSE

modalWindowController.getModalState("OtherModal"); // NOT_CONNECTED
```

re-knownout - https://github.com/knownout/
<br>knownout@hotmail.com
