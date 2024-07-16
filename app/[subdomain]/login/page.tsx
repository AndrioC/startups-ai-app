export default function Login() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-[#F5F7FA]">
      {/* Welcome Text */}
      <h1 className="text-center text-black font-semibold text-[48px]">
        Bem-vindo de volta!
      </h1>

      {/* Login Form */}
      <div className="bg-white shadow-lg rounded-lg mt-10 w-[660px] h-[640px] flex flex-col items-center">
        {/* Logo */}
        <img
          src="/path/to/logo.png"
          alt="Logo"
          className="mt-[40px] mb-[20px]"
        />

        {/* Instruction Text */}
        <p className="text-[#4087C2] font-medium text-[15px] mb-6">
          Digite seu usuário e senha para acessar o sistema.
        </p>

        {/* Email Input */}
        <div className="relative w-[526px] mb-6">
          <input
            type="email"
            placeholder="Digite seu e-mail"
            className="w-full h-[50px] pl-10 text-[#A2B0C2] text-[15px] bg-[#EBE9E9] rounded-md"
          />
          <span className="absolute left-3 top-3">
            <img
              src="/path/to/email-icon.png"
              alt="Email Icon"
              className="h-6 w-6"
            />
          </span>
        </div>

        {/* Password Input */}
        <div className="relative w-[526px] mb-6">
          <input
            type="password"
            placeholder="Digite sua senha"
            className="w-full h-[50px] pl-10 text-[#A2B0C2] text-[15px] bg-[#EBE9E9] rounded-md"
          />
          <span className="absolute left-3 top-3">
            <img
              src="/path/to/password-icon.png"
              alt="Password Icon"
              className="h-6 w-6"
            />
          </span>
        </div>

        {/* Register and Forgot Password Links */}
        <div className="w-[526px] flex justify-between mb-6">
          <a
            href="/register"
            className="text-[#A0AEC0] font-medium text-[15px]"
          >
            Cadastrar
          </a>
          <a
            href="/forgot-password"
            className="text-[#A0AEC0] font-medium text-[15px]"
          >
            Esqueci minha senha
          </a>
        </div>

        {/* Submit Button */}
        <button className="bg-[#4087C2] text-white font-medium text-[15px] rounded-[30px] w-[175px] h-[50px] shadow-lg">
          Entrar
        </button>
      </div>
    </div>
  );
}
