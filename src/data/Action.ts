interface Action {
    title: string,
    action: () => void,
    classes?: string,
    closeModal?: boolean,
    hotkey?: string
}
export default Action;