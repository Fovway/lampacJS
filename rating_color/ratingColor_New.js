(function () {
  "use strict";

  function initSettings() {
    try {
      if (Lampa.SettingsApi.remove) {
        Lampa.SettingsApi.remove("rating_color");
      }
    } catch (e) {}

    // === Настройки ===
    Lampa.SettingsApi.addComponent({
      component: "rating_color",
      name: "Fovway",
      icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/></svg>',
    });

    function applyRatingColorToggle(value) {
      Lampa.Storage.set("fParams_ratingColor", value);
      Lampa.Noty.show("Цветные плашки: " + (value ? "Включены" : "Выключены"));
      updateRating();
    }

    Lampa.SettingsApi.addParam({
      component: "rating_color",
      param: { name: "rating_color_toggle", type: "trigger", default: true },
      field: {
        name: "Цветные плашки",
        description:
          "Включает или выключает цветные плашки на рейтинг, статус, качество",
      },
      onChange: applyRatingColorToggle,
    });

    function applyExitBtnToggle(value) {
      Lampa.Storage.set("fParams_exitBtn", value);
      Lampa.Noty.show("Кнопка выход: " + (value ? "Включена" : "Выключена"));
      addExitBtn();
    }

    Lampa.SettingsApi.addParam({
      component: "rating_color",
      param: { name: "exitBtn_toggle", type: "trigger", default: true },
      field: {
        name: "Кнопка выход",
        description: "Кнопка выхода в верхнем меню",
      },
      onChange: applyExitBtnToggle,
    });

    function applyReloadBtnToggle(value) {
      Lampa.Storage.set("fParams_reloadBtn", value);
      Lampa.Noty.show(
        "Кнопка перезагрузки: " + (value ? "Включена" : "Выключена")
      );
      addReloadBtn();
    }

    Lampa.SettingsApi.addParam({
      component: "rating_color",
      param: { name: "reloadBtn_toggle", type: "trigger", default: true },
      field: {
        name: "Кнопка перезагрузки",
        description: "Кнопка перезагрузки в верхнем меню",
      },
      onChange: applyReloadBtnToggle,
    });

    // === Кнопки ===
    function addReloadBtn() {
      const storageValue = Lampa.Storage.get("fParams_reloadBtn");
      const reloadBtn = document.querySelector(".reload--btn");
      const headActions = document.querySelector(".head__actions");

      if (!storageValue) {
        reloadBtn?.remove();
        return;
      }

      if (!reloadBtn && headActions) {
        headActions.insertAdjacentHTML(
          "beforeend",
          `<div class='head__action selector reload--btn'>
            <svg fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" stroke-width="0.48">
              <path d="M4,12a1,1,0,0,1-2,0A9.983,9.983,0,0,1,18.242,4.206V2.758a1,1,0,1,1,2,0v4a1,1,0,0,1-1,1h-4a1,1,0,0,1,0-2h1.743A7.986,7.986,0,0,0,4,12Zm17-1a1,1,0,0,0-1,1A7.986,7.986,0,0,1,7.015,18.242H8.757a1,1,0,1,0,0-2h-4a1,1,0,0,0-1,1v4a1,1,0,0,0,2,0V19.794A9.984,9.984,0,0,0,22,12,1,1,0,0,0,21,11Z" fill="currentColor"></path>
            </svg>
          </div>`
        );

        const newReloadBtn = document.querySelector(".reload--btn");
        if (newReloadBtn) {
          // Кешируем обработчик для предотвращения повторного добавления
          if (!addReloadBtn.handlerAttached) {
            $(newReloadBtn).on("hover:enter hover:click hover:touch", () => location.reload());
            addReloadBtn.handlerAttached = true;
          }
        }
      }
    }

    function addExitBtn() {
      const storageValue = Lampa.Storage.get("fParams_exitBtn");
      const sourceBtn = document.querySelector(".source-btn");
      const headActions = document.querySelector(".head__actions");

      if (!storageValue) {
        sourceBtn?.remove();
        return;
      }

      if (!sourceBtn && headActions) {
        headActions.insertAdjacentHTML(
          "beforeend",
          `<div class='head__action selector source-btn'>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z" fill="currentColor"></path>
            </svg>
          </div>`
        );

        const newSourceBtn = document.querySelector(".source-btn");
        if (newSourceBtn) {
          // Кешируем обработчик для предотвращения повторного добавления
          if (!addExitBtn.handlerAttached) {
            $(newSourceBtn).on("hover:enter hover:click hover:touch", function () {
              if (Lampa.Platform.is("apple_tv")) window.location.assign("exit://exit");
              if (Lampa.Platform.is("tizen"))
                tizen.application.getCurrentApplication().exit();
              if (Lampa.Platform.is("webos")) window.close();
              if (Lampa.Platform.is("android")) Lampa.Android.exit();
              if (Lampa.Platform.is("orsay")) Lampa.Orsay.exit();
              if (Lampa.Platform.is("nw")) nw.Window.get().close();
            });
            addExitBtn.handlerAttached = true;
          }
        }
      }
    }

    // === Стилизация плашек ===
    function updateRating(){
        if(Lampa.Storage.get('fParams_ratingColor') !== true) return;

        // Получаем актуальные элементы при каждом вызове (не кешируем)
        const cardVote = document.querySelectorAll('.card__vote');
        const qCard = document.querySelectorAll('.card__quality');
        const cardMarker = document.querySelectorAll('.card__marker');

        // Функция для применения стиля к элементам
        const applyStyles = (elements, styles) => {
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                for (const property in styles) {
                    element.style[property] = styles[property];
                }
            }
        };

        // Общие стили для cardVote
        const commonVoteStyles = {
            bottom: "5.5em",
            left: "-0.8em",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            height: "20px",
            padding: "0 8px",
            borderRadius: "6px",
            fontSize: "10px",
            fontWeight: "600",
            marginBottom: "6px",
            width: "fit-content"
        };

        // Применяем цвета рейтингов
        for (let i = 0; i < cardVote.length; i++) {
            const voteCard = cardVote[i];
            const rating = parseFloat(voteCard.innerHTML);

            // Применяем общие стили
            applyStyles([voteCard], commonVoteStyles);

            if (rating >= 0 && rating <= 3.9) {
                voteCard.style.color = "black";
                voteCard.style.background = "linear-gradient(90deg,#0F6775 0%,#0F5375 100%)";
            } else if (rating >= 4 && rating <= 6.9) {
                voteCard.style.color = "black";
                voteCard.style.background = "linear-gradient(90deg,#FF8707 0%,#FFC107 100%)";
            } else if (rating >= 7 && rating <= 7.9) {
                voteCard.style.color = "black";
                voteCard.style.background = "linear-gradient(90deg,#43A047 0%,#8CFF00 100%)";
            } else if (rating >= 8 && rating <= 10) {
                voteCard.style.color = "black";
                voteCard.style.background = "linear-gradient(90deg,rgba(254, 219, 55, 1) 0%, rgba(255, 255, 172, 1) 50%, rgba(253, 185, 49, 1) 100%)";
            }
        }

        // Общие стили для qCard
        const commonQCardStyles = {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            height: "20px",
            padding: "0 8px",
            borderRadius: "6px",
            fontSize: "10px",
            fontWeight: "600",
            marginBottom: "6px",
            width: "fit-content",
            background: "linear-gradient(90deg,#FFDD00 0%,#FFEE7D 100%)"
        };
        applyStyles(qCard, commonQCardStyles);

        // Общие стили для cardMarker
        const commonMarkerStyles = {
            left: "-0.8em",
            background: "linear-gradient(90deg,#2A7B9B 0%,#57C785 100%)",
            color: "white",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            height: "20px",
            padding: "0 8px",
            borderRadius: "6px",
            fontSize: "10px",
            fontWeight: "600",
            marginBottom: "6px",
            width: "fit-content"
        };
        applyStyles(cardMarker, commonMarkerStyles);
    }

    document.addEventListener("DOMContentLoaded", () => setTimeout(updateRating, 500));
    const observer = new MutationObserver(() => updateRating());
    observer.observe(document.body, { childList: true, subtree: true });

    addReloadBtn();
    addExitBtn();
    updateRating();
  }

  if (window.appready) initSettings();
  else {
    Lampa.Listener.follow("app", (e) => {
      if (e.type === "ready") initSettings();
    });
  }
})();
