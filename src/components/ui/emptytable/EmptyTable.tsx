
export const EmptyTable = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="table-scroll">
      <table>{children}</table>
    </div>
  )
}
