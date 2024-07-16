export default function Page() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center justify-between bg-white h-[80px] px-10">
        <img src="/path/to/logo.png" alt="Logo" className="h-10" />
        <button className="bg-black bg-opacity-78 text-white rounded-full w-[120px] h-[40px] text-[20px] font-bold">
          Entrar
        </button>
      </header>

      {/* Presentation Section */}
      <section className="flex flex-col items-center justify-center bg-blue-600 h-[400px] text-center">
        <h1 className="text-white text-[64px] font-extrabold">
          As inscrições estão abertas!
        </h1>
        <button className="bg-[#FC8847] w-[200px] h-[50px] rounded-lg mt-10">
          Acesse agora
        </button>
      </section>

      {/* Welcome Section */}
      <section className="flex flex-col items-center mt-10">
        <h2 className="text-black text-[48px] font-semibold">
          Bem-vindo à Inovativa!
        </h2>
        <video className="mt-5" width="640" height="480" controls>
          <source src="/path/to/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <p className="mt-10 mx-[90px] text-[20px] font-medium leading-6 text-center">
          O InovAtiva apoia o desenvolvimento do ecossistema de empreendedorismo
          inovador no Brasil. Os programas e eventos do InovAtiva promovem
          diferentes oportunidades de aceleração de negócios inovadores, conexão
          com potenciais investidores e parceiros, e capacitação de
          empreendedores. Conheça e faça parte desta iniciativa que, desde 2013,
          já ajudou a impulsionar mais de 3,9 mil negócios por todo o país.
        </p>
      </section>

      {/* Cards Section */}
      <section className="flex flex-wrap justify-center mt-10 gap-5">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-[#F9F9FC] rounded-[30px] shadow-lg w-[270px] h-[424px] flex flex-col p-5"
          >
            <img
              src={`/path/to/image${index + 1}.png`}
              alt="Empreendedores"
              className="h-24 w-full object-cover"
            />
            <h3 className="text-black text-[20px] font-bold mt-3">
              Empreendedores
            </h3>
            <ul className="mt-2 list-disc pl-5">
              <li>Aceleração</li>
              <li>Mentorias</li>
              <li>Conexão</li>
            </ul>
            <button className="bg-[#0A2979] text-white rounded-[30px] w-[200px] h-[50px] mt-auto mx-auto">
              Sou empreendedor
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
