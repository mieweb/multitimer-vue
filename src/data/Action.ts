interface Action {
    title: string,
    action: () => void,
    classes?: string,
    closeModal?: boolean,
    hotkey?: string,
    disabled?: boolean
}
export default Action;