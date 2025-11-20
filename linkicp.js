/** 
 * Dimensional Permit Auto-Badge (Right-Bottom + Left Expand) 
 */ 
(function () { 
    // ================= 配置区域 =================
    const CONFIG = {
        baseUrl: "",// 若为空，将自动使用当前目录作为 baseUrl

        textColor: "#1d1d1f",
        font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    };

    // ================= 自动 baseUrl 处理 =================
    if (!CONFIG.baseUrl || CONFIG.baseUrl.trim() === "") {
        CONFIG.baseUrl =
            window.location.origin +
            window.location.pathname.replace(/\/[^/]*$/, "");
    }

    // ================= 1. 资源注入 =================
    function loadFontAwesome() { 
        if (!document.querySelector('link[href*="font-awesome"]')) { 
            const link = document.createElement('link'); 
            link.rel = 'stylesheet'; 
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'; 
            document.head.appendChild(link); 
        } 
    } 

    // ================= 2. 样式注入 =================
    function injectStyles() { 
        const style = document.createElement("style"); 
        style.innerHTML = ` 
            #dim-permit-badge { 
                position: fixed; 
                right: 20px; 
                bottom: 20px; 
                z-index: 99999; 
                display: flex; align-items: center; 
                width: 36px; height: 36px; 
                overflow: hidden; 
                background: rgba(255, 255, 255, 0.15); 
                backdrop-filter: blur(10px); 
                -webkit-backdrop-filter: blur(10px); 
                border: 1px solid rgba(255, 255, 255, 0.4); 
                border-radius: 30px; 
                box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.05); 
                color: ${CONFIG.textColor}; 
                font-family: ${CONFIG.font}; 
                font-size: 12px; 
                white-space: nowrap; 
                text-decoration: none; 
                user-select: none; 
                touch-action: none; 
                transform: scale(0.9); 
                opacity: 0; 
                transition: width 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28), opacity 0.4s ease, transform 0.4s ease, background 0.3s; 
                cursor: grab; 
                flex-direction: row-reverse; 
            } 
            #dim-permit-badge.dragging { 
                cursor: grabbing; 
                transition: none !important; 
                box-shadow: 0 8px 20px rgba(0,0,0,0.15); 
            } 
            #dim-permit-badge.visible { 
                transform: scale(1); 
                opacity: 1; 
            } 
            #dim-permit-badge:hover:not(.dragging) { 
                width: auto; 
                padding-left: 15px; 
                padding-right: 0; 
                background: rgba(255, 255, 255, 0.65); 
                box-shadow: 4px 8px 25px rgba(0, 0, 0, 0.1); 
            } 
            .dp-icon-box { 
                min-width: 36px; height: 36px; 
                display: flex; align-items: center; justify-content: center; 
            } 
            .dp-shield { 
                font-size: 16px; 
                background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 25%, #8fd3f4 50%, #84fab0 75%, #a18cd1 100%); 
                background-size: 300% 300%; 
                -webkit-background-clip: text; 
                -webkit-text-fill-color: transparent; 
                background-clip: text; 
                animation: holoFlow 4s linear infinite; 
                pointer-events: none; 
            } 
            @keyframes holoFlow { 
                0% { background-position: 0% 50%; } 
                100% { background-position: 100% 50%; } 
            } 
            .dp-content { 
                display: flex; align-items: center; gap: 8px; 
                opacity: 0; 
                transform: translateX(10px); 
                transition: all 0.4s ease 0.1s; 
                pointer-events: none; 
            } 
            #dim-permit-badge:hover:not(.dragging) .dp-content { 
                opacity: 1; 
                transform: translateX(0); 
            } 
            .dp-divider { width: 1px; height: 10px; background: rgba(0,0,0,0.15); } 
            .dp-date { font-family: 'Courier New', monospace; font-weight: 700; opacity: 0.8; } 
        `; 
        document.head.appendChild(style); 
    } 

    // ================= 3. 主逻辑 =================
    function initBadge() { 
        // 获取当前页面的域名
        let rawHost = window.location.hostname; 
        if (!rawHost || rawHost === "") rawHost = "LOCAL-MODE"; 

        const displayDomain = rawHost.toUpperCase().replace("WWW.", ""); 
        const finalTargetUrl = `${CONFIG.baseUrl}?host=${encodeURIComponent(rawHost)}`; 

        const now = new Date(); 
        const icpCode = `ICP-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`; 

        const badge = document.createElement("a"); 
        badge.id = "dim-permit-badge"; 
        badge.href = finalTargetUrl; 
        badge.target = "_blank";  
        badge.innerHTML = ` 
            <div class="dp-icon-box"> 
                <i class="fas fa-shield-alt dp-shield"></i> 
            </div> 
            <div class="dp-content"> 
                <span>${displayDomain}</span> 
                <span class="dp-divider"></span> 
                <span class="dp-date">${icpCode}</span> 
            </div> 
        `; 

        document.body.appendChild(badge); 

        // ================= 拖拽逻辑 =================
        let isDragging = false, hasMoved = false; 
        let startX, startY, initialLeft, initialTop; 

        const startDrag = (e) => { 
            if (e.type === "mousedown" && e.button !== 0) return; 
            isDragging = true; 
            hasMoved = false; 
            badge.classList.add("dragging"); 
            const clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX; 
            const clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY; 
            startX = clientX; startY = clientY; 
            const rect = badge.getBoundingClientRect(); 
            initialLeft = rect.left; initialTop = rect.top; 
            e.preventDefault(); 
        }; 

        const onDrag = (e) => { 
            if (!isDragging) return; 
            const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX; 
            const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY; 
            const dx = clientX - startX; 
            const dy = clientY - startY; 
            if (Math.abs(dx) > 2 || Math.abs(dy) > 2) hasMoved = true; 
            let newLeft = initialLeft + dx; 
            let newTop = initialTop + dy; 
            const maxLeft = window.innerWidth - badge.offsetWidth; 
            const maxTop = window.innerHeight - badge.offsetHeight; 
            badge.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + "px"; 
            badge.style.top = Math.max(0, Math.min(newTop, maxTop)) + "px"; 
            badge.style.right = "auto"; 
            badge.style.bottom = "auto"; 
        }; 

        const stopDrag = () => { 
            if (!isDragging) return; 
            isDragging = false; 
            badge.classList.remove("dragging"); 
        }; 

        badge.addEventListener("mousedown", startDrag); 
        badge.addEventListener("touchstart", startDrag, { passive: false }); 
        window.addEventListener("mousemove", onDrag); 
        window.addEventListener("touchmove", onDrag, { passive: false }); 
        window.addEventListener("mouseup", stopDrag); 
        window.addEventListener("touchend", stopDrag); 

        // 点击事件：区分拖拽和点击
        badge.addEventListener("click", (e) => { 
            if (hasMoved) { 
                e.preventDefault(); 
                e.stopPropagation(); 
            } else { 
                e.preventDefault(); 
                window.open(finalTargetUrl, "_blank"); 
            } 
        }); 

        // 自动显示在底部
        function checkScroll() { 
            const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight; 
            const scrolled = window.scrollY || window.pageYOffset; 
            if (scrollableHeight <= 0 || scrolled >= scrollableHeight - 80) { 
                badge.classList.add("visible"); 
            } else { 
                badge.classList.remove("visible"); 
            } 
        } 

        window.addEventListener("scroll", checkScroll); 
        window.addEventListener("resize", checkScroll); 
        setTimeout(checkScroll, 500); 
    } 

    loadFontAwesome(); 
    injectStyles(); 

    if (document.readyState === "loading") { 
        document.addEventListener("DOMContentLoaded", initBadge); 
    } else { 
        initBadge(); 
    } 
})();

