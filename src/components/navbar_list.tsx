
export const NavbarList = ({style}:{style:string}) => {
    function Overview() {
        return(
            <div className={style}>
                overview
            </div>
        )
    }
    function Inventory() {
        return(
            <div className={style}>
                inventory
            </div>
        )
    }
    function Warehouse() {
        return(
            <div className={style}>
                warehouse
            </div>
        )
    }
    function Deliveries() {
        return(
            <div className={style}>
                deliveries
            </div>
        )
    }
    function SupplyRequest() {
        return(
            <div className={style}>
                supply_ request
            </div>
        )
    }
    function Cutomers   () {
        return(
            <div className={style}>
                customers
            </div>
        )
    }
     function Returns   () {
        return(
            <div className={style}>
                returns
            </div>
        )
    }
     function History   () {
        return(
            <div className={style}>
                history
            </div>
        )
    }
    return {Overview, Inventory, Warehouse, Deliveries, SupplyRequest, Cutomers, Returns, History}
};

