export default interface Action {
    title: string,
    action: () => void,
    classes?: string,
    closeModal?: boolean
};