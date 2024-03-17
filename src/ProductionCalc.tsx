import React, { useState } from 'react';
import './ProductionCalc.css';

type Cost = {
    oil: number,
    steel: number,
    osr: number
}
type Resource = keyof Cost;
type UnitType = 'LAND' | 'AIR' | 'SEA';
type UnitName = 'INF' | 'ART' | 'ARM' | 'FTR' | 'BMR' | 'SS' | 'CR' | 'CV' | 'BB';
type Unit = {
    name: UnitName,
    cost: Cost,
    color: string,
    type: UnitType,
}

type UnitPurchase = {
    unit: UnitName,
    amount: number,
}

const units: { [NAME in UnitName]: Unit } = {
    'INF': { name: 'INF', color: '#ffff00', cost: { oil: 0, steel: 0, osr: 2 }, type: 'LAND' },
    'ART': { name: 'ART', color: '#4949fb', cost: { oil: 0, steel: 2, osr: 1 }, type: 'LAND' },
    'ARM': { name: 'ARM', color: '#03ab03', cost: { oil: 1, steel: 2, osr: 1 }, type: 'LAND' },
    'FTR': { name: 'FTR', color: '#03ab03', cost: { oil: 2, steel: 1, osr: 1 }, type: 'AIR' },
    'BMR': { name: 'BMR', color: '#d55959', cost: { oil: 2, steel: 2, osr: 1 }, type: 'AIR' },
    'SS': { name: 'SS', color: '#ffff00', cost: { oil: 1, steel: 2, osr: 1 }, type: 'SEA' },
    'CR': { name: 'CR', color: '#4949fb', cost: { oil: 2, steel: 3, osr: 2 }, type: 'SEA' },
    'CV': { name: 'CV', color: '#03ab03', cost: { oil: 4, steel: 3, osr: 3 }, type: 'SEA' },
    'BB': { name: 'BB', color: '#d55959', cost: { oil: 3, steel: 4, osr: 3 }, type: 'SEA' },
};
const unitNames: UnitName[] = Object.keys(units) as UnitName[];

const createEmptyCart = (): UnitPurchase[] => unitNames.map(name => ({ unit: name, amount: 0}));

const getTotal = (cart: UnitPurchase[]): Cost => cart.reduce((total, cartUnit) => ({
    oil: total.oil + (cartUnit.amount * units[cartUnit.unit].cost.oil),
    steel: total.steel + (cartUnit.amount * units[cartUnit.unit].cost.steel),
    osr: total.osr + (cartUnit.amount * units[cartUnit.unit].cost.osr),
}), { oil: 0, steel: 0, osr: 0 });

const unitRow = (unitName: UnitName, amount: number, onAdd: () => void, onSubtract: () => void) => {
    const unit = units[unitName];

    return (
        <div key={unit.name} className={['unit', `unit-${unitName}`, amount ? '' : 'unit-empty'].join(' ')}>
            <button className='unit__name' onClick={onAdd} style={{ color: unit.color}}>{unit.name}</button>
            <div className='unit__cost unit__cost_oil'>{unit.cost.oil * amount}</div>
            <div className='unit__cost unit__cost_steel'>{unit.cost.steel * amount}</div>
            <div className='unit__cost unit__cost_osr'>{unit.cost.osr * amount}</div>
            <button className='unit__cost unit__amount' onClick={onSubtract}>{amount}</button>
        </div>
    )
};

function ProductionCalc() {
    const [cart, updateCart] = useState<UnitPurchase[]>(createEmptyCart());
    
    const addUnit = (name: UnitName) => {
        updateCart(cart.map(({ unit, amount }) => ({ unit, amount: amount + (unit === name ? 1 : 0) })));
    }
    const subtractUnit = (name: UnitName) => {
        updateCart(cart.map(({ unit, amount }) => ({ unit, amount: unit === name ? Math.max(amount - 1, 0) : amount })));
    }

    const total = getTotal(cart);
    return (
        <div className='productionCalc'>
            {cart.map(({ unit, amount }) => unitRow(unit, amount, () => addUnit(unit), () => subtractUnit(unit)))}
            <div className='unit unit-total'>
                <div className='unit__name'>Total</div>
                <div className='unit__cost unit__cost_oil'>{total.oil}</div>
                <div className='unit__cost unit__cost_steel'>{total.steel}</div>
                <div className='unit__cost unit__cost_osr'>{total.osr}</div>
                <div className='unit__cost unit__amount'>{cart.reduce((totalAmount, { amount }) => totalAmount + amount, 0)}</div>
            </div>
        </div>
    )
};


export default ProductionCalc;