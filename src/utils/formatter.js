
const regex_html = /<(.)*?>/;

function formatText(text) {
    var formatted = "";
    formatted = text.replace(regex_html, "")
    formatted = formatted.replace(/\[color=(.+?)\](.+?)\[\/color\]/g, '<span style="color: $1;">$2</span>');
    formatted = formatted.replace(/\[b\](.+?)\[\/b\]/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\[i\](.+?)\[\/i\]/g, '<em>$1</em>');
    formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');
    formatted = formatted.replace(/\[u\](.+?)\[\/u\]/g, '<u>$1</u>')
    formatted = formatted.replace(/_(.+?)_/g, '<u>$1</u>')
    formatted = formatted.replace(/\n/g, '<br/>')

    return formatted;
}

module.exports = {
    formatText,
};