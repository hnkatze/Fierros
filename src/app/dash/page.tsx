import Cards from "@/components/Cards";




export default function Dash() {

    return (
        <main className="w-full h-6/7">
            <div className="flex flex-wrap gap-5 justify-center items-center pt-12 h-6/7">
            <Cards title="Nuevo" urlLink="/new" description="Aqui es donde haremos un nuevo ingreso." />
            <Cards title="Buscar" urlLink="/find" description="Busquemos por DNI al contrubuyente" />
            <Cards title="Galeria" urlLink="/gallery" description="Aqui podremos visualizar las imagenes." />
            <Cards title="Contacto" urlLink="/contac" description="Vamos, si tienes algun problema, contactanos." />
            </div>
            </main>
        
    );
}