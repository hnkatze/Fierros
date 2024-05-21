import { Link } from "@nextui-org/react";

interface CardsProps {
  description: string;
  urlLink: string;
  title: string;
}

 const Cards: React.FC<CardsProps> = ({ description,title, urlLink }) => {
  return (
    <div className="bg-white dark:bg-gray-950 rounded-lg shadow-lg overflow-hidden w-56 h-40">
          <div className="p-4">
            <h2 className="text-lg font-bold mb-2">{title}</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              <span className="mr-2">{description}</span>
            </div>
            <Link
              className="inline-flex items-center justify-center h-9 px-4 rounded-md bg-gray-900 text-gray-50 hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 transition-colors"
              href={urlLink}
            >
              Ir Alla
            </Link>
          </div>
        </div>
  );
};

export default Cards;
