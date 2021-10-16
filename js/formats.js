const FORMATS = {
    omega: {
        config: {
            greek: "βζλψΣΘΨω",
            infinity: "Ω",
        },
        format(value) {
            const step = Decimal.floor(value.div(1000));
            const omegaAmount = Decimal.floor(step.div(this.config.greek.length));
            let lastLetter = this.config.greek[step.toNumber() % this.config.greek.length] + toSubscript(value.toNumber() % 1000);
            const beyondGreekArrayBounds = this.config.greek[step.toNumber() % this.config.greek.length] === undefined;
            if (beyondGreekArrayBounds || step.toNumber() > Number.MAX_SAFE_INTEGER) {
            lastLetter = "ω";
            }
            const omegaOrder = Decimal.log(value, 8000);
            if (omegaAmount.equals(0)) {
            return lastLetter;
            } else if (omegaAmount.gt(0) && omegaAmount.lte(3)) {
            const omegas = [];
            for (let i = 0; i < omegaAmount.toNumber(); i++) {
                omegas.push("ω");
            }
            return `${omegas.join("^")}^${lastLetter}`;
            } else if (omegaAmount.gt(3) && omegaAmount.lt(10)) {
            return `ω(${omegaAmount.toFixed(0)})^${lastLetter}`;
            } else if (omegaOrder < 3) {
            return `ω(${this.format(omegaAmount)})^${lastLetter}`;
            } else if (omegaOrder < 6) {
            return `ω(${this.format(omegaAmount)})`;
            }
            const val = Decimal.pow(8000, omegaOrder % 1);
            const orderStr = omegaOrder < 100
            ? Math.floor(omegaOrder).toFixed(0)
            : this.format(Decimal.floor(omegaOrder));
            return `ω[${orderStr}](${this.format(val)})`;
        },
    },
    omega_short: {
        config: {
            greek: "βζλψΣΘΨω",
            infinity: "Ω",
        },
        format(value) {
            const step = Decimal.floor(value.div(1000));
            const omegaAmount = Decimal.floor(step.div(this.config.greek.length));
            let lastLetter = this.config.greek[step.toNumber() % this.config.greek.length] + toSubscript(value.toNumber() % 1000);
            const beyondGreekArrayBounds = this.config.greek[step.toNumber() % this.config.greek.length] === undefined;
            if (beyondGreekArrayBounds || step.toNumber() > Number.MAX_SAFE_INTEGER) {
            lastLetter = "ω";
            }
            const omegaOrder = Decimal.log(value, 8000);
            if (omegaAmount.equals(0)) {
            return lastLetter;
            } else if (omegaAmount.gt(0) && omegaAmount.lte(2)) {
            const omegas = [];
            for (let i = 0; i < omegaAmount.toNumber(); i++) {
                omegas.push("ω");
            }
            return `${omegas.join("^")}^${lastLetter}`;
            } else if (omegaAmount.gt(2) && omegaAmount.lt(10)) {
            return `ω(${omegaAmount.toFixed(0)})^${lastLetter}`;
            }
            const val = Decimal.pow(8000, omegaOrder % 1);
            const orderStr = omegaOrder < 100
            ? Math.floor(omegaOrder).toFixed(0)
            : this.format(Decimal.floor(omegaOrder));
            return `ω[${orderStr}](${this.format(val)})`;
        }
    },
    elemental: {
        config: {
            element_lists: [["H"],
            ["He", "Li", "Be", "B", "C", "N", "O", "F"],
            ["Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl"],
            [
              "Ar", "K", "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe",
              "Co", "Ni", "Cu", "Zn", "Ga", "Ge", "As", "Se", "Br"
            ],
            [
              "Kr", "Rb", "Sr", "Y", "Zr", "Nb", "Mo", "Tc", "Ru",
              "Rh", "Pd", "Ag", "Cd", "In", "Sn", "Sb", "Te", "I"
            ],
            [
              "Xe", "Cs", "Ba", "La", "Ce", "Pr", "Nd", "Pm",
              "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm",
              "Yb", "Lu", "Hf", "Ta", "W", "Re", "Os", "Ir",
              "Pt", "Au", "Hg", "Tl", "Pb", "Bi", "Po", "At"
            ],
            [
              "Rn", "Fr", "Ra", "Ac", "Th", "Pa", "U", "Np",
              "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm", "Md",
              "No", "Lr", "Rf", "Db", "Sg", "Bh", "Hs", "Mt",
              "Ds", "Rg", "Cn", "Nh", "Fl", "Mc", "Lv", "Ts"
            ],
            ["Og"]],
        },
        getAbbreviationAndValue(x) {
            const abbreviationListIndexUnfloored = Math.log(x) / Math.log(118);
            const abbreviationListIndex = Math.floor(abbreviationListIndexUnfloored);
            const abbreviationList = this.config.element_lists[Math.floor(abbreviationListIndex)];
            const abbreviationSublistIndex = Math.floor(
              (abbreviationListIndexUnfloored - abbreviationListIndex) * abbreviationList.length);
            const abbreviation = abbreviationList[abbreviationSublistIndex];
            const value = 118 ** (abbreviationListIndex + abbreviationSublistIndex / abbreviationList.length);
            return [abbreviation, value];
        },
        formatElementalPart(abbreviation, n) {
            if (n === 1) {
              return abbreviation;
            }
            return `${n} ${abbreviation}`;
        },
        format(value) {
            let log = value.log(118);
            const parts = [];
            while (log >= 1 && parts.length < 4) {
              const [abbreviation, value] = this.getAbbreviationAndValue(log);
              const n = Math.floor(log / value);
              log -= n * value;
              parts.unshift([abbreviation, n]);
            }
            if (parts.length >= 4) {
              return parts.map((x) => this.formatElementalPart(x[0], x[1])).join(" + ");
            }
            const formattedMantissa = Decimal.pow(118, log).toFixed(4);
            if (parts.length === 0) {
              return formattedMantissa;
            }
            if (parts.length === 1) {
              return `${formattedMantissa} × ${this.formatElementalPart(parts[0][0], parts[0][1])}`;
            }
            return `${formattedMantissa} × (${parts.map((x) => this.formatElementalPart(x[0], x[1])).join(" + ")})`;
        },
    },
}

const SUBSCRIPT_NUMBERS = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"];

function toSubscript(value) {
    return value.toFixed(0).split("")
      .map((x) => x === "-" ? "₋" : SUBSCRIPT_NUMBERS[parseInt(x, 10)])
      .join("");
}