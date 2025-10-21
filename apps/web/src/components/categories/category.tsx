const Category = ({ name, color }: {name: string, color: string}) => {

  return (
    <div className="flex items-center h-6 gap-4">

      <div className={`h-full w-1 rounded-xl`} style={{ backgroundColor: color }}/>

      <p className="text-lg">{name}</p>
    </div>
  )
}

export default Category;
