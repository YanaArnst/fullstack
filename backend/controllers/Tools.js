import Tool from "../models/ToolModel.js";
import User from "../models/UserModel.js";

export const getTools = async (req, res) => {
        try {
            const response = await Tool.findAll({
                attributes:['id','name','price','deposit','costPerDay','description'],
                include:[{
                    model: User,
                    attributes:['name','email']
                }]
            });
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({msg: error.message});
        }
}



export const getToolById = async (req, res) => {
    try {
        const response = await Tool.findOne({
            attributes:['id','name','price','deposit','costPerDay','description'],
            where:{
                id: req.params.id
            },
            include:[{
                model: User,
                attributes:['name','email']
            }]
        });
        if(!Tool) return res.status(404).json({msg: "Инструмент не найден"});
    
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }

}

export const createTool = async (req, res) => {
    const {name, price, deposit, costPerDay, description} = req.body;
    try {
        await Tool.create({
            name: name,
            price: price,
            deposit: deposit,
            costPerDay: costPerDay,
            description: description,
            userId: req.userId
        });
        res.status(201).json({msg: "Инструмент успешно создан"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateTool = async (req, res) => {
    try {

        await Tool.update(req.body, {
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Инструмент успешно обновлен"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

//удалять может только админ
export const deleteTool = async(req, res) => {
    try {
        const tool = await Tool.findOne({
            where:{
                id: req.params.id
            }
        });
        if(!tool) return res.status(404).json({msg: "Инструмент не найден"});
        const {name, price, deposit, costPerDay, description} = req.body;
        if(req.role === "admin"){
            await Tool.destroy({
                where:{
                    id: tool.id
                }
            });
        }else{
            return res.status(403).json({msg: "Доступ запрещен"});
        }
        res.status(200).json({msg: "Инструмент успешно удален"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }

}