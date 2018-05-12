export const textSelection = (el, onSelect) => {
    el.addEventListener('mouseup', () => {
        let selectedText = '';
        if (window.getSelection) {
            selectedText = window.getSelection().toString();
        } else if (document.selection) {
            selectedText = document.selection.createRange().text;
        }

        onSelect(selectedText);
    })
}