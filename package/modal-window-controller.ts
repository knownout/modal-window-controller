import { action, makeObservable, observable } from "mobx";

export enum TModalWindowState {
    NOT_CONNECTED = "not_connected",
    MOUNT = "mount",
    OPEN = "open",
    OPENING = "opening",
    CLOSE = "close",
    CLOSING = "closing",
}

/**
 * Контроллер, управляющий всеми модальными окнами приложения, за исключением
 * тех, которые были добавлены сторонними пакетами.
 */
class ModalWindowController {
    /** Объект, содержащий данные о подключенных модальных окнах */
    @observable private connectedModals: { [key: string]: TModalWindowState } = {};

    /**
     * Время переключения модального окна со статуса CLOSING/OPENING
     * в статус CLOSE/OPEN, мс.
     */
    @observable private modalChangeTime = 300;

    /**
     * Контроллер, управляющий всеми модальными окнами приложения, за исключением
     * тех, которые были добавлены сторонними пакетами.
     */
    constructor () {
        makeObservable(this);
    }

    /**
     * Метод для подключения модального окна к контроллеру.
     *
     * Уникальный ключ модального окна должен быть задан в файле ".modal.keys.ts".
     *
     * @param {string} key уникальный ключ модального окна.
     */
    @action
    public connectModalWindow (key: string): void {
        this.connectedModals = {
            ...this.connectedModals,
            [key]: TModalWindowState.CLOSE
        };
    }

    /**
     * Метод для отключения модального окна от контроллера.
     * @param {string} key уникальный ключ модального окна.
     */
    @action
    public disconnectModalWindow (key: string): void {
        this.connectedModals = Object.fromEntries(Object.entries(this.connectedModals)
            .filter(([ modalKey ]) => modalKey !== key));
    }

    /**
     * Метод для получения текущего состояния модального окна.
     * @param {string} key уникальный ключ модального окна.
     * @return {TModalWindowState} текущее состояние модального окна.
     */
    @observable
    public getModalState (key: string): TModalWindowState {
        if (!Object.keys(this.connectedModals).includes(key))
            return TModalWindowState.NOT_CONNECTED;

        return this.connectedModals[key] as TModalWindowState;
    }

    /**
     * Метод для открытия модального окна.
     *
     * Если модальное окно уже открыто или не подключено, метод ничего не сделает.
     *
     * @param {string} key уникальный ключ модального окна.
     */
    @action
    public openModal (key: string): void {
        if (!this.modalAvailable(key) || this.connectedModals[key] === TModalWindowState.OPEN) return;

        this.changeModalState(key, TModalWindowState.MOUNT);

        setTimeout(() => {
            this.changeModalState(key, TModalWindowState.OPENING);

            setTimeout(() => this.changeModalState(key, TModalWindowState.OPEN), this.modalChangeTime);
        }, 30);
    }

    /**
     * Метод для закрытия открытого модального окна.
     *
     * Если модальное окно закрыто или не подключено, метод ничего не сделает.
     *
     * @param {string} key уникальный ключ модального окна.
     */
    @action
    public closeModal (key: string): void {
        if (!this.modalAvailable(key) || this.connectedModals[key] === TModalWindowState.CLOSE) return;

        this.changeModalState(key, TModalWindowState.CLOSING);

        setTimeout(() => this.changeModalState(key, TModalWindowState.CLOSE), this.modalChangeTime);
    }

    /**
     * Метод изменения скорости обновления состояний модальных окон.
     *
     * @param {number} time новая скорость обновления состояний (мс.).
     */
    @action
    public updateStateChangeTime (time: number) {
        this.modalChangeTime = time;
    }

    /**
     * Метод для проверки, не находится ли определенное модальное окно в переходном состоянии.
     * @param {string} key уникальный ключ модального окна.
     * @return {boolean} True если окно находится в статичном состоянии.
     * @private
     */
    @observable
    private modalAvailable (key: string): boolean {
        const notAvailableStates: TModalWindowState[] = [
            TModalWindowState.OPENING,
            TModalWindowState.NOT_CONNECTED,
            TModalWindowState.CLOSING
        ];

        return !notAvailableStates.includes(this.connectedModals[key] as TModalWindowState);
    }

    /**
     * Метод для изменения состояния модального окна.
     * @param {string} key уникальный ключ модального окна.
     * @param {TModalWindowState} state новое состояние модального окна.
     * @private
     */
    @action
    private changeModalState (key: string, state: TModalWindowState): void {
        this.connectedModals = {
            ...this.connectedModals,
            [key]: state
        };
    }
}

const modalWindowController = new ModalWindowController();
export default modalWindowController;
