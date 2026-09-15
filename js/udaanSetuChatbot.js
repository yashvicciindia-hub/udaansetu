(function () {
  const STORAGE_KEY = "udaanSetu_chat_history";
  const OPEN_KEY = "udaanSetu_chat_open";
  const engine = window.UdaanSetuChatEngine;

  function loadHistory() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn("Could not load chat history:", error);
    }
    return [engine.createWelcomeMessage()];
  }

  function persistHistory(messages) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.warn("Could not save chat history:", error);
    }
  }

  function persistOpenState(isOpen) {
    try {
      localStorage.setItem(OPEN_KEY, JSON.stringify(isOpen));
    } catch (error) {
      console.warn("Could not save chat open state:", error);
    }
  }

  function getInitialOpenState() {
    try {
      const saved = localStorage.getItem(OPEN_KEY);
      if (saved) {
        return JSON.parse(saved) === true;
      }
    } catch (error) {
      console.warn("Could not load chat open state:", error);
    }
    return false;
  }

  class UdaanSetuChatbot {
    constructor() {
      this.messages = loadHistory();
      this.isOpen = getInitialOpenState();
      this.isTyping = false;
      this.confirmingClear = false;
      this.root = null;
      this.messageList = null;
      this.suggestionList = null;
      this.input = null;
      this.sendButton = null;
      this.launcher = null;
      this.widget = null;
      this.clearConfirm = null;
    }

    init() {
      if (!document.body || document.getElementById("udaansetu-chatbot-root")) {
        return;
      }

      const root = document.createElement("div");
      root.id = "udaansetu-chatbot-root";
      root.setAttribute("aria-live", "polite");
      root.innerHTML = `
        <button id="udaansetu-chat-launcher" class="udaansetu-launcher" type="button" aria-label="Open UdaanSetu Assistant">
          <span class="udaansetu-launcher-icon" aria-hidden="true">
            <svg viewBox="0 0 64 64" role="img" aria-hidden="true">
              <path d="M20 27.8C20 21.9 24.8 17 30.8 17h12.5c7.1 0 12.7 5.8 12.7 12.8v12.2c0 5.5-4.5 10-10 10h-4.5l-7.4 8.1c-1 1.2-2.8 1.3-4 .2l-.3-.3c-1.1-1.1-1.1-2.9 0-4l3.9-4.4h-6.8c-7.1 0-12.7-5.8-12.7-12.8V27.8Z" fill="none" stroke="currentColor" stroke-width="2.7" stroke-linejoin="round"/>
              <circle cx="28.6" cy="33.4" r="2.9" fill="currentColor"/>
              <circle cx="39.5" cy="33.4" r="2.9" fill="currentColor"/>
              <path d="M27 41c2.2 2.4 5.4 3.5 9 3.5 3.5 0 6.8-1.1 9-3.5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </span>
          <span class="udaansetu-launcher-pulse" aria-hidden="true"></span>
        </button>
        <aside id="udaansetu-chat-widget" class="udaansetu-chat-widget ${this.isOpen ? "open" : ""}" aria-label="UdaanSetu Assistant chat window" aria-hidden="${this.isOpen ? "false" : "true"}">
          <header class="udaansetu-chat-header">
            <div class="udaansetu-header-brand">
              <span class="udaansetu-header-icon" aria-hidden="true">
                <svg viewBox="0 0 64 64" role="img" aria-hidden="true">
                  <path d="M20 27.8C20 21.9 24.8 17 30.8 17h12.5c7.1 0 12.7 5.8 12.7 12.8v12.2c0 5.5-4.5 10-10 10h-4.5l-7.4 8.1c-1 1.2-2.8 1.3-4 .2l-.3-.3c-1.1-1.1-1.1-2.9 0-4l3.9-4.4h-6.8c-7.1 0-12.7-5.8-12.7-12.8V27.8Z" fill="none" stroke="currentColor" stroke-width="2.7" stroke-linejoin="round"/>
                  <circle cx="28.6" cy="33.4" r="2.9" fill="currentColor"/>
                  <circle cx="39.5" cy="33.4" r="2.9" fill="currentColor"/>
                  <path d="M27 41c2.2 2.4 5.4 3.5 9 3.5 3.5 0 6.8-1.1 9-3.5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                </svg>
              </span>
              <div>
                <h3>UdaanSetu Assistant</h3>
                <p>Your guide to India's livelihood ecosystem</p>
              </div>
            </div>
            <div class="udaansetu-header-actions">
              <span class="udaansetu-status" aria-label="Assistant online"><span class="dot"></span> Ready</span>
              <button type="button" class="udaansetu-icon-button" data-action="clear" aria-label="Clear conversation">✕</button>
            </div>
          </header>

          <div class="udaansetu-clear-confirm hidden" id="udaansetu-clear-confirm" aria-live="assertive">
            <div class="udaansetu-dialog">
              <p>Clear this conversation?</p>
              <div class="udaansetu-dialog-actions">
                <button type="button" class="udaansetu-cancel" data-action="cancel-clear">Cancel</button>
                <button type="button" class="udaansetu-clear-action" data-action="confirm-clear">Clear</button>
              </div>
            </div>
          </div>

          <div class="udaansetu-chat-body">
            <div class="udaansetu-message-list" id="udaansetu-message-list" aria-live="polite"></div>
            <div class="udaansetu-suggestions" id="udaansetu-suggestions"></div>
          </div>

          <form class="udaansetu-chat-form" id="udaansetu-chat-form">
            <label class="sr-only" for="udaansetu-chat-input">Ask about UdaanSetu</label>
            <textarea id="udaansetu-chat-input" rows="1" placeholder="Ask about UdaanSetu..." aria-label="Ask about UdaanSetu" maxlength="600"></textarea>
            <button type="submit" class="udaansetu-send-button" aria-label="Send message">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 12.5 17.5 4l-3.5 14-3.9-5.1L3.5 12.5Z" fill="currentColor"/></svg>
            </button>
          </form>
        </aside>
      `;
      document.body.appendChild(root);

      this.root = root;
      this.widget = document.getElementById("udaansetu-chat-widget");
      this.launcher = document.getElementById("udaansetu-chat-launcher");
      this.messageList = document.getElementById("udaansetu-message-list");
      this.suggestionList = document.getElementById("udaansetu-suggestions");
      this.input = document.getElementById("udaansetu-chat-input");
      this.clearConfirm = document.getElementById("udaansetu-clear-confirm");

      this.launcher.addEventListener("click", () => this.toggleOpen());
      this.attachClearAction();
      this.renderMessages();
      this.bindForm();
      this.bindAutoResize();
      this.toggleOpen(this.isOpen, false);
    }

    bindForm() {
      const form = document.getElementById("udaansetu-chat-form");
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const value = this.input.value.trim();
        if (!value) return;
        this.sendMessage(value);
      });
    }

    bindAutoResize() {
      this.input.addEventListener("input", () => {
        this.input.style.height = "auto";
        this.input.style.height = `${Math.min(this.input.scrollHeight, 130)}px`;
      });
      this.input.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          const value = this.input.value.trim();
          if (!value) return;
          this.sendMessage(value);
        }
      });
    }

    attachClearAction() {
      const clearButton = this.widget.querySelector('[data-action="clear"]');
      const cancelButton = this.widget.querySelector('[data-action="cancel-clear"]');
      const confirmButton = this.widget.querySelector('[data-action="confirm-clear"]');

      clearButton.addEventListener("click", () => {
        this.confirmingClear = true;
        this.clearConfirm.classList.remove("hidden");
      });

      cancelButton.addEventListener("click", () => {
        this.confirmingClear = false;
        this.clearConfirm.classList.add("hidden");
      });

      confirmButton.addEventListener("click", () => {
        this.confirmingClear = false;
        this.clearConfirm.classList.add("hidden");
        this.resetChat();
      });
    }

    toggleOpen(forceOpen, persist = true) {
      const nextState = typeof forceOpen === "boolean" ? forceOpen : !this.isOpen;
      this.isOpen = nextState;
      this.widget.classList.toggle("open", nextState);
      this.widget.setAttribute("aria-hidden", nextState ? "false" : "true");
      this.launcher.classList.toggle("is-open", nextState);
      this.launcher.setAttribute("aria-label", nextState ? "Close UdaanSetu Assistant" : "Open UdaanSetu Assistant");
      if (persist) {
        persistOpenState(this.isOpen);
      }
      if (nextState && this.input) {
        setTimeout(() => this.input.focus(), 80);
      }
    }

    renderMessages() {
      if (!this.messageList) return;
      this.messageList.innerHTML = this.messages.map((message) => {
        const role = message.role === "user" ? "user" : "assistant";
        const bubbleText = engine.sanitizeMessageText(message.text || "");
        const meta = role === "assistant" ? '<span class="udaansetu-bubble-meta">UdaanSetu</span>' : '';
        return `
          <div class="udaansetu-message ${role}">
            ${role === "assistant" ? '<span class="udaansetu-avatar" aria-hidden="true">U</span>' : ""}
            <div class="udaansetu-bubble-wrap">
              ${meta}
              <div class="udaansetu-bubble">${bubbleText}</div>
            </div>
          </div>
        `;
      }).join("");

      this.messageList.scrollTop = this.messageList.scrollHeight;
      this.renderSuggestions();
    }

    renderSuggestions() {
      if (!this.suggestionList) return;
      const latestMessage = [...this.messages].reverse().find((msg) => msg.role === "assistant");
      const suggestions = latestMessage && Array.isArray(latestMessage.suggestions) && latestMessage.suggestions.length
        ? latestMessage.suggestions
        : engine.defaultSuggestions;

      this.suggestionList.innerHTML = suggestions.map((item) => `
        <button type="button" class="udaansetu-suggestion" data-prompt="${item.replace(/"/g, '&quot;')}">${item}</button>
      `).join("");

      this.suggestionList.querySelectorAll(".udaansetu-suggestion").forEach((button) => {
        button.addEventListener("click", () => {
          const prompt = button.getAttribute("data-prompt");
          if (prompt) {
            this.sendMessage(prompt);
          }
        });
      });
    }

    sendMessage(rawText) {
      const text = String(rawText || "").trim();
      if (!text) return;

      this.messages.push({ role: "user", text });
      this.input.value = "";
      this.input.style.height = "auto";
      persistHistory(this.messages);
      this.renderMessages();

      this.showTypingIndicator();

      setTimeout(() => {
        const reply = engine.generateReply(text, engine.getSessionContext());
        const assistantMessage = {
          role: "assistant",
          text: reply.text,
          suggestions: reply.suggestions || engine.defaultSuggestions
        };
        this.messages.push(assistantMessage);
        this.hideTypingIndicator();
        persistHistory(this.messages);
        this.renderMessages();
      }, 550);
    }

    showTypingIndicator() {
      if (this.isTyping) return;
      this.isTyping = true;
      const typing = document.createElement("div");
      typing.className = "udaansetu-message assistant typing-indicator-row";
      typing.id = "udaansetu-typing";
      typing.innerHTML = `
        <span class="udaansetu-avatar" aria-hidden="true">U</span>
        <div class="udaansetu-bubble-wrap">
          <span class="udaansetu-bubble-meta">UdaanSetu</span>
          <div class="udaansetu-bubble typing-bubble" aria-live="polite" aria-label="UdaanSetu Assistant is typing">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
          </div>
        </div>
      `;
      this.messageList.appendChild(typing);
      this.messageList.scrollTop = this.messageList.scrollHeight;
    }

    hideTypingIndicator() {
      const typing = document.getElementById("udaansetu-typing");
      if (typing) typing.remove();
      this.isTyping = false;
    }

    resetChat() {
      this.messages = [engine.createWelcomeMessage()];
      engine.setSessionContext({
        userType: "",
        lastTopic: "",
        recentTopics: []
      });
      persistHistory(this.messages);
      this.renderMessages();
      this.toggleOpen(true, true);
    }
  }

  window.UdaanSetuChatbot = new UdaanSetuChatbot();

  document.addEventListener("DOMContentLoaded", () => {
    if (window.UdaanSetuChatEngine) {
      window.UdaanSetuChatbot.init();
    }
  });
})();
