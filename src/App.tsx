import { useState } from "react";
import type { ReactNode } from "react";
import {
  YEAR,
  MONTH_NAMES,
  WEEKDAY_NAMES,
  HOLIDAYS,
  dateKey,
  getMonthDays,
  getHolidaysForMonth,
} from "./calendar.ts";

type IconName =
  | "calendar"
  | "print"
  | "arrow"
  | "grid"
  | "month"
  | "spark"
  | "star"
  | "book"
  | "heart";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M7 3v4m10-4v4M3 11h18m-13 4h2m4 0h2" />
      </>
    ),
    print: (
      <>
        <path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <path d="M6 14h12v7H6zm12-2h.01" />
      </>
    ),
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
    month: (
      <>
        <rect x="3" y="4" width="18" height="17" rx="3" />
        <path d="M3 10h18M8 2v4m8-4v4m-8 9h8" />
      </>
    ),
    spark: (
      <>
        <path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4Z" />
        <path d="m20 2 .5 1.5L22 4l-1.5.5L20 6l-.5-1.5L18 4l1.5-.5Z" />
      </>
    ),
    star: (
      <path d="m12 2 3.1 6.3L22 9.3l-5 4.9 1.2 6.8-6.2-3.2-6.2 3.2L7 14.2 2 9.3l6.9-1Z" />
    ),
    book: (
      <>
        <path d="M12 5v16m0-16C9 3 5 3 2 4v15c3-1 7-1 10 2m0-16c3-2 7-2 10-1v15c-3-1-7-1-10 2" />
      </>
    ),
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

type Module = "home" | "calendar" | "print" | "holidays";

function CalendarCover() {
  return (
    <div className="calendar-preview">
      <div className="paper-accent" />
      <div className="preview-paper">
        <span className="preview-year">2027</span>
        <span className="preview-month">JANEIRO</span>
        <div className="preview-weekdays">
          {WEEKDAY_NAMES.map((day) => (
            <span key={day}>{day.slice(0, 1)}</span>
          ))}
        </div>
        <div className="preview-days">
          {getMonthDays(0).map((day, index) => (
            <span
              key={index}
              className={day === 1 ? "preview-highlight" : undefined}
            >
              {day}
            </span>
          ))}
        </div>
        <span className="preview-caption">
          novos dias, novas possibilidades
        </span>
      </div>
    </div>
  );
}

function PrintCover() {
  return (
    <div className="print-preview">
      <div className="print-paper paper-back">
        <small>MEUS PLANOS</small>
        <h3>2027</h3>
        <div className="print-line" />
        <div className="print-line" />
        <div className="print-line" />
      </div>
      <div className="print-paper paper-front">
        <span className="print-spark">
          <Icon name="spark" size={28} />
        </span>
        <small>UM NOVO CAPÍTULO</small>
        <h3>
          um dia
          <br />
          <em>de cada vez.</em>
        </h3>
        <div className="print-line" />
        <div className="print-line" />
        <div className="print-line" />
        <span className="print-paper-footer">feito para os seus planos ♡</span>
      </div>
    </div>
  );
}

function DatesCover() {
  return (
    <div className="dates-preview">
      <h3 className="dates-title">
        dias para
        <br />
        <em>celebrar.</em>
      </h3>
      {[
        ["01", "JAN", "Novos começos", "Confraternização Universal"],
        ["21", "ABR", "Uma pausa na rotina", "Tiradentes"],
        ["25", "DEZ", "Tempo de estar perto", "Natal"],
      ].map(([day, month, title, subtitle]) => (
        <div className="dates-preview-row" key={month}>
          <span className="dates-mini-day">
            <strong>{day}</strong>
            <small>{month}</small>
          </span>
          <span className="dates-mini-copy">
            <strong>{title}</strong>
            <small>{subtitle}</small>
          </span>
          <Icon name="heart" size={15} />
        </div>
      ))}
    </div>
  );
}

function Calendar({
  index,
  large = false,
  highlight,
  selectedDate,
  onSelect,
  openMonth,
}: {
  index: number;
  large?: boolean;
  highlight: boolean;
  selectedDate: string | null;
  onSelect: (date: string) => void;
  openMonth: (index: number) => void;
}) {
  const holidays = getHolidaysForMonth(index);
  const nationalCount = holidays.filter(
    (day) => day.kind === "national",
  ).length;
  return (
    <article
      className={"calendar-card" + (large ? " large" : "")}
      aria-label={MONTH_NAMES[index] + " de " + YEAR}
    >
      <div className="month-heading">
        {large ? (
          <h2>{MONTH_NAMES[index]}</h2>
        ) : (
          <h2>
            <button
              onClick={() => openMonth(index)}
              title={"Ver " + MONTH_NAMES[index]}
            >
              {MONTH_NAMES[index]}
              <span className="month-open">
                <Icon name="arrow" size={14} />
              </span>
            </button>
          </h2>
        )}
        <span className="month-number">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="weekdays" aria-hidden="true">
        {WEEKDAY_NAMES.map((day, i) => (
          <span
            key={day}
            className={i === 0 || i === 6 ? "weekend-label" : undefined}
          >
            {day}
          </span>
        ))}
      </div>
      <div className="days-grid">
        {getMonthDays(index).map((day, position) => {
          if (!day)
            return (
              <span
                className="empty-day"
                key={"blank-" + position}
                aria-hidden="true"
              />
            );
          const key = dateKey(index, day);
          const holiday = holidays.find((item) => item.date === key);
          const weekend = position % 7 === 0 || position % 7 === 6;
          const label =
            day +
            " de " +
            MONTH_NAMES[index].toLocaleLowerCase("pt-BR") +
            " de " +
            YEAR +
            (holiday ? ", " + holiday.name : "");
          const classes = [
            "day",
            weekend ? "weekend" : "",
            highlight && holiday ? "holiday " + holiday.kind : "",
            selectedDate === key ? "selected" : "",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <button
              key={key}
              className={classes}
              aria-label={label}
              aria-pressed={selectedDate === key}
              title={holiday?.name}
              onClick={() => onSelect(key)}
            >
              <span>{day}</span>
              {large && holiday && highlight && <small>{holiday.name}</small>}
            </button>
          );
        })}
      </div>
      {!large && (
        <div className="month-note">
          {nationalCount === 1
            ? "1 feriado nacional"
            : nationalCount > 1
              ? nationalCount + " feriados nacionais"
              : "Um mês cheio de possibilidades"}
        </div>
      )}
    </article>
  );
}

function App() {
  const [screen, setScreen] = useState<Module>("home");
  const [view, setView] = useState<"year" | "month">("year");
  const [month, setMonth] = useState(0);
  const [highlight, setHighlight] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const nationalHolidays = HOLIDAYS.filter((day) => day.kind === "national");
  const observances = HOLIDAYS.filter((day) => day.kind === "observance");
  const selectedHoliday = HOLIDAYS.find((day) => day.date === selectedDate);
  const selectedText = selectedDate
    ? new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "full",
        timeZone: "UTC",
      }).format(new Date(selectedDate + "T12:00:00Z"))
    : "";

  function showModule(next: Module) {
    setScreen(next);
    setView("year");
    setMonth(0);
    setSelectedDate(null);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function openMonth(index: number) {
    setMonth(index);
    setView("month");
    setSelectedDate(null);
  }

  function selectDate(date: string) {
    setSelectedDate(date);
    setMonth(Number(date.slice(5, 7)) - 1);
  }

  function openHoliday(date: string) {
    setScreen("calendar");
    setMonth(Number(date.slice(5, 7)) - 1);
    setView("month");
    setSelectedDate(date);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  const calendarProps = {
    highlight,
    selectedDate,
    onSelect: selectDate,
    openMonth,
  };
  const modules: {
    key: Exclude<Module, "home">;
    category: string;
    title: string;
    description: string;
    button: string;
    icon: IconName;
    cover: ReactNode;
  }[] = [
    {
      key: "calendar",
      category: "COLEÇÃO PRINCIPAL",
      title: "Calendários 2027",
      description:
        "Explore os 12 meses do ano, com feriados nacionais e espaço para novos começos.",
      button: "Acessar calendários",
      icon: "star",
      cover: <CalendarCover />,
    },
    {
      key: "print",
      category: "PARA IMPRIMIR",
      title: "Seu ano no papel",
      description:
        "Prepare seu calendário anual ou mensal para imprimir e salvar como PDF.",
      button: "Preparar impressão",
      icon: "book",
      cover: <PrintCover />,
    },
    {
      key: "holidays",
      category: "DATAS ESPECIAIS",
      title: "Feriados & celebrações",
      description:
        "Descubra os feriados e as datas especiais para planejar cada pausa do seu ano.",
      button: "Ver feriados",
      icon: "spark",
      cover: <DatesCover />,
    },
  ];

  function HolidayList({ days }: { days: typeof HOLIDAYS }) {
    return (
      <div className="holiday-list">
        {days.map((day) => (
          <button
            key={day.date}
            className={"holiday-list-item " + day.kind}
            onClick={() => openHoliday(day.date)}
          >
            <span className="holiday-date">
              <strong>{day.date.slice(-2)}</strong>
              <small>
                {MONTH_NAMES[Number(day.date.slice(5, 7)) - 1]
                  .slice(0, 3)
                  .toLocaleUpperCase("pt-BR")}
              </small>
            </span>
            <span className="holiday-name">
              {day.name}
              <small>
                {new Intl.DateTimeFormat("pt-BR", {
                  weekday: "long",
                  timeZone: "UTC",
                }).format(new Date(day.date + "T12:00:00Z"))}
              </small>
            </span>
            <Icon name="arrow" size={17} />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="creative-app">
      <a
        href={screen === "home" ? "#modulos" : "#conteudo"}
        className="skip-link"
      >
        Ir para o conteúdo
      </a>
      {screen === "home" ? (
        <main className="home-screen">
          <header className="library-hero">
            <span className="eyebrow-pill">
              <Icon name="spark" size={15} />
              SUA ÁREA DE CALENDÁRIOS
            </span>
            <h1 className="library-title">Sua biblioteca criativa de 2027</h1>
            <p className="library-subtitle">
              Escolha um módulo abaixo e dê vida aos seus próximos planos.
            </p>
          </header>
          <section
            id="modulos"
            className="module-grid"
            aria-label="Módulos da biblioteca"
          >
            {modules.map((module) => (
              <article className="module-card" key={module.key}>
                <div
                  className={
                    "module-cover cover-" +
                    (module.key === "holidays" ? "dates" : module.key)
                  }
                  aria-hidden="true"
                >
                  <div className="cover-frame">{module.cover}</div>
                </div>
                <div className="module-content">
                  <span className="module-badge">
                    <Icon name={module.icon} size={14} />
                    {module.category}
                  </span>
                  <h2 className="module-title">{module.title}</h2>
                  <p className="module-description">{module.description}</p>
                  <button
                    className="primary-button"
                    onClick={() => showModule(module.key)}
                  >
                    {module.button}
                    <Icon name="arrow" size={17} />
                  </button>
                </div>
              </article>
            ))}
          </section>
        </main>
      ) : (
        <main className="detail-screen" id="conteudo">
          <div className="detail-topbar">
            <button className="back-button" onClick={() => showModule("home")}>
              <span className="arrow-back">
                <Icon name="arrow" size={18} />
              </span>
              Voltar à biblioteca
            </button>
            {screen !== "holidays" && (
              <button
                className="secondary-button"
                onClick={() => window.print()}
              >
                <Icon name="print" size={17} />
                Imprimir calendário
              </button>
            )}
          </div>
          <header className="detail-heading">
            <span className="eyebrow-pill">
              <Icon
                name={
                  screen === "calendar"
                    ? "calendar"
                    : screen === "print"
                      ? "book"
                      : "spark"
                }
                size={15}
              />
              {screen === "calendar"
                ? "COLEÇÃO PRINCIPAL"
                : screen === "print"
                  ? "PARA IMPRIMIR"
                  : "DATAS ESPECIAIS"}
            </span>
            <h1 className="detail-title">
              {screen === "calendar"
                ? "Seus calendários de 2027"
                : screen === "print"
                  ? "Seus planos também cabem no papel"
                  : "Um ano de datas especiais"}
            </h1>
            <p className="library-subtitle">
              {screen === "calendar"
                ? "Um ano inteiro de possibilidades, um dia de cada vez."
                : screen === "print"
                  ? "Escolha a sua visualização e leve seus próximos capítulos para o papel."
                  : "Uma pausa na rotina também merece um lugar nos seus planos."}
            </p>
          </header>
          {screen === "holidays" ? (
            <section
              className="holidays-section"
              aria-labelledby="holidays-title"
            >
              <div className="holidays-heading">
                <h2 id="holidays-title">Feriados nacionais de 2027</h2>
                <span className="module-badge">9 FERIADOS NACIONAIS</span>
              </div>
              <HolidayList days={nationalHolidays} />
              <div className="holidays-heading observances-heading">
                <h2>Datas comemorativas</h2>
                <span className="module-badge">4 DATAS MÓVEIS</span>
              </div>
              <HolidayList days={observances} />
              <p className="legal-note">
                Feriados estaduais e municipais não estão incluídos. Carnaval,
                Paixão de Cristo, Páscoa e Corpus Christi aparecem como datas
                comemorativas; sua observância e os pontos facultativos dependem
                da legislação e do calendário local.
              </p>
            </section>
          ) : (
            <section
              className="calendar-section"
              aria-labelledby="calendar-title"
            >
              {screen === "print" && (
                <div className="print-info">
                  <Icon name="print" size={21} />
                  <span>
                    Na janela de impressão do seu navegador, escolha a
                    impressora ou a opção <strong>Salvar como PDF</strong>. A
                    visualização escolhida abaixo será preparada
                    automaticamente.
                  </span>
                </div>
              )}
              <div className="detail-toolbar">
                <h2 id="calendar-title">Calendário {YEAR}</h2>
                <div
                  className="view-switch"
                  role="group"
                  aria-label="Visualização do calendário"
                >
                  <button
                    className={view === "year" ? "active" : ""}
                    aria-pressed={view === "year"}
                    onClick={() => setView("year")}
                  >
                    <Icon name="grid" size={16} />
                    Ano completo
                  </button>
                  <button
                    className={view === "month" ? "active" : ""}
                    aria-pressed={view === "month"}
                    onClick={() => setView("month")}
                  >
                    <Icon name="month" size={17} />
                    Por mês
                  </button>
                </div>
              </div>
              <div className="calendar-options">
                <div className="legend">
                  <span>
                    <i className="national-dot" />
                    Feriado nacional
                  </span>
                  <span>
                    <i className="observance-dot" />
                    Data comemorativa
                  </span>
                </div>
                <label className="highlight-control">
                  <input
                    type="checkbox"
                    checked={highlight}
                    onChange={(event) => setHighlight(event.target.checked)}
                  />
                  <span className="toggle-track" aria-hidden="true" />
                  Destacar datas
                </label>
              </div>
              {view === "month" && (
                <div className="month-navigation">
                  <button
                    aria-label="Mês anterior"
                    disabled={month === 0}
                    onClick={() => {
                      setMonth(month - 1);
                      setSelectedDate(null);
                    }}
                  >
                    <span className="arrow-back">
                      <Icon name="arrow" size={18} />
                    </span>
                  </button>
                  <label>
                    <span className="sr-only">Escolher mês</span>
                    <select
                      value={month}
                      onChange={(event) => {
                        setMonth(Number(event.target.value));
                        setSelectedDate(null);
                      }}
                    >
                      {MONTH_NAMES.map((name, index) => (
                        <option value={index} key={name}>
                          {name} de {YEAR}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    aria-label="Próximo mês"
                    disabled={month === 11}
                    onClick={() => {
                      setMonth(month + 1);
                      setSelectedDate(null);
                    }}
                  >
                    <Icon name="arrow" size={18} />
                  </button>
                </div>
              )}
              <div
                className={view === "year" ? "calendar-grid" : "monthly-layout"}
              >
                {view === "year" ? (
                  MONTH_NAMES.map((_, index) => (
                    <Calendar key={index} index={index} {...calendarProps} />
                  ))
                ) : (
                  <>
                    <Calendar index={month} large {...calendarProps} />
                    <aside className="month-sidebar">
                      <span className="module-badge">NA AGENDA</span>
                      <h3>
                        Datas de {MONTH_NAMES[month].toLocaleLowerCase("pt-BR")}
                      </h3>
                      {getHolidaysForMonth(month).length ? (
                        getHolidaysForMonth(month).map((day) => (
                          <button
                            key={day.date}
                            className={
                              "agenda-item" +
                              (selectedDate === day.date
                                ? " agenda-selected"
                                : "")
                            }
                            onClick={() => setSelectedDate(day.date)}
                          >
                            <span className="agenda-day">
                              {day.date.slice(-2)}
                            </span>
                            <span>
                              <strong>{day.name}</strong>
                              <small>
                                {day.kind === "national"
                                  ? "Feriado nacional"
                                  : "Data comemorativa"}
                              </small>
                            </span>
                          </button>
                        ))
                      ) : (
                        <p className="quiet-month">
                          Nenhum feriado nacional ou data comemorativa listada
                          neste mês. Aproveite para criar seus próprios
                          momentos.
                        </p>
                      )}
                      <div className="sidebar-note">
                        <Icon name="heart" size={21} />
                        <p>
                          Os melhores planos começam
                          <br />
                          com um dia de cada vez.
                        </p>
                      </div>
                    </aside>
                  </>
                )}
              </div>
              <div
                className={
                  "selection-note" + (selectedDate ? " has-selection" : "")
                }
                role="status"
                aria-live="polite"
              >
                <Icon name="calendar" size={18} />
                {selectedDate ? (
                  <span>
                    <strong>{selectedText}</strong>
                    {selectedHoliday
                      ? " · " +
                        selectedHoliday.name +
                        (selectedHoliday.kind === "national"
                          ? " (feriado nacional)"
                          : " (data comemorativa)")
                      : " · Um bom dia para seus planos."}
                  </span>
                ) : (
                  <span>Clique em uma data para ver os detalhes.</span>
                )}
                {selectedDate && (
                  <button
                    onClick={() => setSelectedDate(null)}
                    aria-label="Fechar detalhes da data"
                  >
                    ×
                  </button>
                )}
              </div>
              <p className="legal-note">
                Calendário do Brasil. Feriados locais não estão incluídos; a
                observância das datas comemorativas depende da legislação e do
                calendário local.
              </p>
            </section>
          )}
        </main>
      )}
      <footer className="library-footer">
        Feito com <span aria-label="amor">♥</span> para quem ama planejar.
      </footer>
    </div>
  );
}

export default App;
