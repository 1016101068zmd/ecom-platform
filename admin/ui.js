// ui.js
(function () {
  function ensureToast() {
    let el = document.getElementById("toast");
    if (el) return el;
    el = document.createElement("div");
    el.id = "toast";
    el.style.cssText = `
      position:fixed;left:50%;top:18px;transform:translateX(-50%);
      background:#111;color:#fff;padding:10px 14px;border-radius:10px;
      font-size:13px;opacity:0;pointer-events:none;transition:.2s;
      box-shadow:0 10px 24px rgba(0,0,0,.18);z-index:9999;
    `;
    document.body.appendChild(el);
    return el;
  }

  function toast(msg) {
    const el = ensureToast();
    el.textContent = msg;
    el.style.opacity = "1";
    clearTimeout(el._t);
    el._t = setTimeout(() => (el.style.opacity = "0"), 1600);
  }

  function ensureDialog() {
    let dlg = document.getElementById("dlg");
    if (dlg) return dlg;
    dlg = document.createElement("dialog");
    dlg.id = "dlg";
    dlg.style.cssText = `
      border:none;border-radius:12px;padding:0;max-width:520px;width:92vw;
      box-shadow:0 18px 42px rgba(0,0,0,.25);
    `;
    dlg.innerHTML = `
      <div style="padding:16px 18px;background:#fff;">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;">
          <b id="dlgTitle" style="font-size:15px;color:#333;">标题</b>
          <button id="dlgClose" style="border:none;background:#eef2ff;color:#4b7bec;border-radius:10px;padding:6px 10px;cursor:pointer;">关闭</button>
        </div>
        <div id="dlgBody" style="margin-top:12px;"></div>
        <div id="dlgFoot" style="display:flex;gap:10px;justify-content:flex-end;margin-top:14px;"></div>
      </div>
    `;
    document.body.appendChild(dlg);

    dlg.querySelector("#dlgClose").addEventListener("click", () => dlg.close("cancel"));
    return dlg;
  }

  function confirmBox(message) {
    const dlg = ensureDialog();
    dlg.querySelector("#dlgTitle").textContent = "确认操作";
    dlg.querySelector("#dlgBody").innerHTML = `<div style="color:#444;font-size:14px;line-height:1.6;">${message}</div>`;
    dlg.querySelector("#dlgFoot").innerHTML = `
      <button id="btnCancel" style="padding:9px 12px;border:none;border-radius:10px;background:#fff;color:#4b7bec;border:1px solid #cbd6ff;cursor:pointer;">取消</button>
      <button id="btnOk" style="padding:9px 12px;border:none;border-radius:10px;background:#4b7bec;color:#fff;cursor:pointer;">确认</button>
    `;

    return new Promise((resolve) => {
      dlg.querySelector("#btnCancel").onclick = () => { dlg.close("cancel"); resolve(false); };
      dlg.querySelector("#btnOk").onclick = () => { dlg.close("ok"); resolve(true); };
      dlg.showModal();
    });
  }

  function productForm(initial) {
    const dlg = ensureDialog();
    dlg.querySelector("#dlgTitle").textContent = initial ? "编辑商品" : "新增商品";
    dlg.querySelector("#dlgBody").innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <div>
          <div style="font-size:12px;color:#666;margin-bottom:6px;">商品名</div>
          <input id="pf_name" style="width:100%;padding:9px 10px;border:1px solid #ddd;border-radius:10px;outline:none;" value="${initial?.name ?? ""}" />
        </div>
        <div>
          <div style="font-size:12px;color:#666;margin-bottom:6px;">分类</div>
          <input id="pf_cat" style="width:100%;padding:9px 10px;border:1px solid #ddd;border-radius:10px;outline:none;" value="${initial?.category ?? "其他"}" />
        </div>
        <div>
          <div style="font-size:12px;color:#666;margin-bottom:6px;">价格（元）</div>
          <input id="pf_price" type="number" min="0" step="1" style="width:100%;padding:9px 10px;border:1px solid #ddd;border-radius:10px;outline:none;" value="${initial?.price ?? 99}" />
        </div>
        <div>
          <div style="font-size:12px;color:#666;margin-bottom:6px;">库存</div>
          <input id="pf_stock" type="number" min="0" step="1" style="width:100%;padding:9px 10px;border:1px solid #ddd;border-radius:10px;outline:none;" value="${initial?.stock ?? 10}" />
        </div>
        <div style="grid-column:1/3;">
          <div style="font-size:12px;color:#666;margin-bottom:6px;">状态</div>
          <select id="pf_status" style="width:100%;padding:9px 10px;border:1px solid #ddd;border-radius:10px;outline:none;background:#fff;">
            <option value="ON" ${initial?.status === "ON" ? "selected" : ""}>上架</option>
            <option value="OFF" ${initial?.status === "OFF" ? "selected" : ""}>下架</option>
          </select>
        </div>
        <div id="pf_err" style="grid-column:1/3;color:#e74c3c;font-size:12px;min-height:16px;"></div>
      </div>
    `;
    dlg.querySelector("#dlgFoot").innerHTML = `
      <button id="pf_cancel" style="padding:9px 12px;border:none;border-radius:10px;background:#fff;color:#4b7bec;border:1px solid #cbd6ff;cursor:pointer;">取消</button>
      <button id="pf_ok" style="padding:9px 12px;border:none;border-radius:10px;background:#4b7bec;color:#fff;cursor:pointer;">保存</button>
    `;

    return new Promise((resolve) => {
      dlg.querySelector("#pf_cancel").onclick = () => { dlg.close("cancel"); resolve(null); };
      dlg.querySelector("#pf_ok").onclick = () => {
        const name = (document.getElementById("pf_name").value || "").trim();
        const category = (document.getElementById("pf_cat").value || "").trim() || "其他";
        const price = Number(document.getElementById("pf_price").value);
        const stock = Number(document.getElementById("pf_stock").value);
        const status = document.getElementById("pf_status").value;

        const err = document.getElementById("pf_err");
        if (!name) return (err.textContent = "商品名不能为空");
        if (!Number.isFinite(price) || price <= 0) return (err.textContent = "价格必须 > 0");
        if (!Number.isFinite(stock) || stock < 0) return (err.textContent = "库存必须 ≥ 0");

        dlg.close("ok");
        resolve({ name, category, price, stock, status });
      };
      dlg.showModal();
    });
  }

  window.UI = { toast, confirmBox, productForm };
})();
