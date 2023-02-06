var tooltips, hover_tooltip, tooltip_div, tt_time = 0;

const TOOLTIP_CONFING = {
    padding_x: 5,
    padding_y: 5,
    def_align: 'center',
    def_pos: 'top',
    def_text_align: 'center',
}

function updateTooltips() {
    let style = tooltip_div.style

    if (hover_tooltip) {
        tt_time = Math.min(1,tt_time+diff/500)
        style.display = 'block';

        let attr_html = hover_tooltip.getAttribute('tooltip-html') || '',
        attr_align = hover_tooltip.getAttribute('tooltip-align') || TOOLTIP_CONFING.def_align,
        attr_pos = hover_tooltip.getAttribute('tooltip-pos') || TOOLTIP_CONFING.def_pos,
        text_align = hover_tooltip.getAttribute('tooltip-text-align') || TOOLTIP_CONFING.def_text_align;

        tooltip_div.innerHTML = attr_html

        let ht_rect = hover_tooltip.getBoundingClientRect()
        let t_rect = tooltip_div.getBoundingClientRect()

        let [dx,dy] = [0,0]

        if (attr_pos == 'bottom') dy = ht_rect.bottom + 8*tt_time
        else if (attr_pos == 'top') dy = ht_rect.top - t_rect.height - 8*tt_time

        if (attr_align == 'left') dx = ht_rect.left
        else if (attr_align == 'center') dx = ht_rect.left + (ht_rect.width - t_rect.width) / 2
        else if (attr_align == 'right') {
            dx = ht_rect.right - t_rect.width
        }

        style.top = Math.max(TOOLTIP_CONFING.padding_y,dy) + window.scrollY
        style.left = Math.max(TOOLTIP_CONFING.padding_x,Math.min(window.innerWidth-t_rect.width-TOOLTIP_CONFING.padding_x,dx)) + window.scrollX
        style['text-align'] = text_align
    } else {
        style.display = 'none';
        style.top = 0;
        style.left = 0;
        tt_time = 0
    }

    style.opacity = tt_time;
}

function setupTooltips() {
    tooltips = document.getElementsByClassName('tooltip')
    tooltip_div = document.getElementById('tooltip-div')

    for (let i = 0; i < tooltips.length; i++) {
        let tooltip = tooltips[i];

        tooltip.onmouseenter = function() {
            hover_tooltip = tooltip

            updateTooltips()
        }

        tooltip.onmouseleave = function() {
            hover_tooltip = null

            updateTooltips()
        }
    }

    setInterval(updateTooltips,1000/30)
}