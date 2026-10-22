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

function Icon({
  name,
  size = 20,
}: {
  name: "calendar" | "print" | "arrow" | "grid" | "month" | "spark";
  size?: number;
}) {
  const paths: Record<string, ReactNode> = {
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
    arrow: <path d="m9 5 7 7-7 7" />,
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
      className={`calendar-card ${large ? "large" : ""}`}
      aria-label={`${MONTH_NAMES[index]} de ${YEAR}`}
    >
      <div className="month-heading">
        {large ? (
          <h2>{MONTH_NAMES[index]}</h2>
        ) : (
          <h2>
            <button
              onClick={() => openMonth(index)}
              title={`Ver ${MONTH_NAMES[index]}`}
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
          <span key={day} className={i === 0 || i === 6 ? "weekend-label" : ""}>
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
                key={`blank-${position}`}
                aria-hidden="true"
              />
            );
          const key = dateKey(index, day);
          const holiday = holidays.find((item) => item.date === key);
          const weekend = position % 7 === 0 || position % 7 === 6;
          const label = `${day} de ${MONTH_NAMES[index].toLocaleLowerCase("pt-BR")} de ${YEAR}${holiday ? `, ${holiday.name}` : ""}`;
          return (
            <button
              key={key}
              className={`day ${weekend ? "weekend" : ""} ${highlight && holiday ? `holiday ${holiday.kind}` : ""} ${selectedDate === key ? "selected" : ""}`}
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
              ? `${nationalCount} feriados nacionais`
              : "Um mês cheio de possibilidades"}
        </div>
      )}
    </article>
  );
}

function App() {
  const [view, setView] = useState<"year" | "month">("year");
  const [month, setMonth] = useState(0);
  const [highlight, setHighlight] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const nationalHolidays = HOLIDAYS.filter((day) => day.kind === "national");
  const selectionHoliday = HOLIDAYS.find((day) => day.date === selectedDate);
  const selectionText = selectedDate
    ? new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "full",
        timeZone: "UTC",
      }).format(new Date(`${selectedDate}T12:00:00Z`))
    : "";

  function openMonth(index: number) {
    setMonth(index);
    setView("month");
    setSelectedDate(null);
  }

  function selectDate(date: string) {
    setSelectedDate(date);
    setMonth(Number(date.slice(5, 7)) - 1);
  }

  const calendarProps = {
    highlight,
    selectedDate,
    onSelect: selectDate,
    openMonth,
  };

  return (
    <>
      <a href="#calendario" className="skip-link">
        Ir para o calendário
      </a>
      <header className="site-header">
        <div className="header-inner">
          <a
            className="brand"
            href="#"
            aria-label="Calendários 2027, início"
            onClick={() => setView("year")}
          >
            <span className="brand-icon">
              <Icon name="calendar" size={23} />
            </span>
            <span>
              calendários<span className="brand-year">2027</span>
            </span>
          </a>
          <div className="header-actions">
            <span className="free-label">
              <span /> Simples. Gratuito. Seu.
            </span>
            <button className="print-button" onClick={() => window.print()}>
              <Icon name="print" size={17} />
              <span>Imprimir calendário</span>
            </button>
          </div>
        </div>
      </header>

      <main className="page-shell">
        <section className="hero" aria-labelledby="page-title">
          <div className="hero-copy">
            <div className="eyebrow">
              <span /> SEU TEMPO, SUAS POSSIBILIDADES
            </div>
            <h1 id="page-title">
              O seu próximo capítulo
              <br />
              começa em <span>2027.</span>
            </h1>
            <p>
              Um ano inteiro para planejar, viver e fazer acontecer.
              <br className="desktop-break" /> Todos os meses e feriados, em um
              só lugar.
            </p>
            <div className="hero-details">
              <span>
                <Icon name="calendar" size={15} /> 365 novos dias
              </span>
              <span className="detail-divider" />
              <span>Calendário do Brasil</span>
            </div>
          </div>
          <div className="year-art" aria-hidden="true">
            <div className="year-orbit" />
            <span className="year-watermark">
              20
              <br />
              27
            </span>
            <div className="little-note">
              <span className="note-star">
                <Icon name="spark" size={21} />
              </span>
              <div>
                Espaço para
                <br />
                <strong>novos começos.</strong>
              </div>
            </div>
            <span className="art-plus">+</span>
          </div>
        </section>

        <section
          id="calendario"
          className="calendar-section"
          aria-labelledby="calendar-title"
        >
          <div className="section-toolbar">
            <div>
              <h2 id="calendar-title">
                Calendário {YEAR}
                <span>JAN — DEZ</span>
              </h2>
              <p>Escolha seu ritmo. Planeje do seu jeito.</p>
            </div>
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
                <i className="national-dot" /> Feriado nacional
              </span>
              <span>
                <i className="observance-dot" /> Data comemorativa
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

          <div className={view === "year" ? "calendar-grid" : "monthly-layout"}>
            {view === "year" ? (
              MONTH_NAMES.map((_, index) => (
                <Calendar key={index} index={index} {...calendarProps} />
              ))
            ) : (
              <>
                <Calendar index={month} large {...calendarProps} />
                <aside className="month-sidebar">
                  <span className="eyebrow">NA AGENDA</span>
                  <h3>
                    Datas de {MONTH_NAMES[month].toLocaleLowerCase("pt-BR")}
                  </h3>
                  {getHolidaysForMonth(month).length ? (
                    getHolidaysForMonth(month).map((day) => (
                      <button
                        key={day.date}
                        className={`agenda-item ${selectedDate === day.date ? "agenda-selected" : ""}`}
                        onClick={() => setSelectedDate(day.date)}
                      >
                        <span className="agenda-day">{day.date.slice(-2)}</span>
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
                      Nenhum feriado nacional ou data comemorativa listada neste
                      mês. Aproveite para criar seus próprios momentos.
                    </p>
                  )}
                  <div className="sidebar-note">
                    <Icon name="spark" size={22} />
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
            className={`selection-note ${selectedDate ? "has-selection" : ""}`}
            role="status"
            aria-live="polite"
          >
            <Icon name="calendar" size={18} />
            {selectedDate ? (
              <span>
                <strong>{selectionText}</strong>
                {selectionHoliday
                  ? ` · ${selectionHoliday.name}${selectionHoliday.kind === "national" ? " (feriado nacional)" : " (data comemorativa)"}`
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
        </section>

        <section className="holidays-section" aria-labelledby="holidays-title">
          <div className="holidays-heading">
            <div>
              <span className="eyebrow">UMA PAUSA TAMBÉM FAZ PARTE</span>
              <h2 id="holidays-title">Feriados nacionais de 2027</h2>
              <p>Para organizar a rotina e aproveitar os dias de descanso.</p>
            </div>
            <span className="holiday-count">9 feriados nacionais</span>
          </div>
          <div className="holiday-list">
            {nationalHolidays.map((day) => (
              <button
                key={day.date}
                className="holiday-list-item"
                onClick={() => {
                  openMonth(Number(day.date.slice(5, 7)) - 1);
                  setSelectedDate(day.date);
                  document
                    .getElementById("calendario")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
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
                    }).format(new Date(`${day.date}T12:00:00Z`))}
                  </small>
                </span>
                <Icon name="arrow" size={15} />
              </button>
            ))}
          </div>
          <p className="legal-note">
            Feriados estaduais e municipais não estão incluídos. Carnaval,
            Paixão de Cristo, Páscoa e Corpus Christi aparecem como datas
            comemorativas; sua observância e os pontos facultativos dependem da
            legislação e do calendário local.
          </p>
        </section>

        <section className="print-banner">
          <span className="print-banner-icon">
            <Icon name="print" size={30} />
          </span>
          <div>
            <h2>Seus planos também cabem no papel.</h2>
            <p>
              Imprima a visualização escolhida ou salve como PDF pelo seu
              navegador.
            </p>
          </div>
          <button onClick={() => window.print()}>
            Preparar impressão
            <Icon name="arrow" size={17} />
          </button>
        </section>
      </main>
      <footer className="site-footer">
        <span className="footer-brand">
          calendários<span>2027</span>
        </span>
        <p>Feito para simplificar os seus dias.</p>
        <span>Brasil · Português</span>
      </footer>
    </>
  );
}

export default App;
